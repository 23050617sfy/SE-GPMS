from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ThesisSerializer, ThesisReviewSerializer, TopicSerializer
from .serializers import ProposalSerializer, MidtermCheckSerializer
from .serializers import ProposalReviewSerializer, MidtermReviewSerializer
from .models import Thesis, ThesisReview, Topic, TopicSelection
from .models import Proposal, MidtermCheck
from .serializers import TopicSerializer
from .models import Topic
from django.db.models import Q
from django.db.models.functions import Concat
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


class RegisterAPIView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        data = {
            'token': token.key,
            'user': UserSerializer(user).data,
        }
        return Response(data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']

        # allow login via student_id (username) or email
        user = None
        try:
            user = User.objects.get(username=identifier)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.check_password(password):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        token, _ = Token.objects.get_or_create(user=user)
        user_data = UserSerializer(user).data
        # add display name: prefer last_name+first_name for Chinese style
        first = getattr(user, 'first_name', '') or ''
        last = getattr(user, 'last_name', '') or ''
        full = (last + first).strip()
        if full:
            user_data['name'] = full
        else:
            full_name = user.get_full_name().strip()
            user_data['name'] = full_name if full_name else user.username
        return Response({'token': token.key, 'user': user_data})


class MeAPIView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = request.user
        user_data = UserSerializer(user).data
        first = getattr(user, 'first_name', '') or ''
        last = getattr(user, 'last_name', '') or ''
        full = (last + first).strip()
        if full:
            user_data['name'] = full
        else:
            full_name = user.get_full_name().strip()
            user_data['name'] = full_name if full_name else user.username
        return Response({'user': user_data})


class ThesisSubmitAPIView(generics.CreateAPIView):
    serializer_class = ThesisSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        # Check if user is a student
        if request.user.profile.role != 'student':
            return Response({'detail': 'Only students can submit thesis'}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class ThesisDetailAPIView(generics.RetrieveUpdateAPIView):
    serializer_class = ThesisSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get_object(self):
        return Thesis.objects.filter(student=self.request.user).order_by('-submitted_at').first()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class StudentThesesListAPIView(generics.ListAPIView):
    serializer_class = ThesisSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Only students can see their own thesis
        if self.request.user.profile.role == 'student':
            return Thesis.objects.filter(student=self.request.user)
        return Thesis.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AllThesesListAPIView(generics.ListAPIView):
    serializer_class = ThesisSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # 管理员看所有论文，教师只看选了自己课程的学生的论文
        if self.request.user.profile.role == 'admin':
            qs = Thesis.objects.all()
        elif self.request.user.profile.role == 'teacher':
            # 教师只能查看选了自己课程的学生的论文
            students_with_my_topics = User.objects.filter(
                selected_topics__topic__teacher=self.request.user
            ).distinct()
            qs = Thesis.objects.filter(student__in=students_with_my_topics)
        else:
            return Thesis.objects.none()
        
        # 支持按学生名称搜索
        query = self.request.query_params.get('username')
        if query:
            q = query.strip()
            # annotate concatenated last_name+first_name for full-name search
            qs = qs.annotate(student_full_name=Concat('student__last_name', 'student__first_name'))
            qs = qs.filter(
                Q(student__username__icontains=q) |
                Q(student__first_name__icontains=q) |
                Q(student__last_name__icontains=q) |
                Q(student_full_name__icontains=q)
            )
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ThesisReviewAPIView(generics.CreateAPIView):
    serializer_class = ThesisReviewSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request, thesis_id, *args, **kwargs):
        # Check if user is a teacher or admin
        if request.user.profile.role not in ['teacher', 'admin']:
            return Response({'detail': 'Only teachers can review theses'}, status=status.HTTP_403_FORBIDDEN)

        try:
            thesis = Thesis.objects.get(id=thesis_id)
        except Thesis.DoesNotExist:
            return Response({'detail': 'Thesis not found'}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['thesis'] = thesis_id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)


class ProposalSubmitAPIView(generics.CreateAPIView):
    serializer_class = ProposalSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        if request.user.profile.role != 'student':
            return Response({'detail': 'Only students can submit proposal'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class MyProposalsListAPIView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.profile.role == 'student':
            return Proposal.objects.filter(student=self.request.user)
        return Proposal.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class MidtermSubmitAPIView(generics.CreateAPIView):
    serializer_class = MidtermCheckSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        if request.user.profile.role != 'student':
            return Response({'detail': 'Only students can submit midterm check'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class MyMidtermsListAPIView(generics.ListAPIView):
    serializer_class = MidtermCheckSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.profile.role == 'student':
            return MidtermCheck.objects.filter(student=self.request.user)
        return MidtermCheck.objects.none()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AllProposalsListAPIView(generics.ListAPIView):
    serializer_class = ProposalSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.profile.role == 'admin':
            qs = Proposal.objects.all()
        elif self.request.user.profile.role == 'teacher':
            # 教师只能查看选了自己课程的学生的提交
            students_with_my_topics = User.objects.filter(
                selected_topics__topic__teacher=self.request.user
            ).distinct()
            qs = Proposal.objects.filter(student__in=students_with_my_topics)
        else:
            return Proposal.objects.none()
        
        # 支持按学生名称搜索
        query = self.request.query_params.get('username')
        if query:
            q = query.strip()
            qs = qs.annotate(student_full_name=Concat('student__last_name', 'student__first_name'))
            qs = qs.filter(
                Q(student__username__icontains=q) |
                Q(student__first_name__icontains=q) |
                Q(student__last_name__icontains=q) |
                Q(student_full_name__icontains=q)
            )
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class AllMidtermsListAPIView(generics.ListAPIView):
    serializer_class = MidtermCheckSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        if self.request.user.profile.role == 'admin':
            qs = MidtermCheck.objects.all()
        elif self.request.user.profile.role == 'teacher':
            # 教师只能查看选了自己课程的学生的提交
            students_with_my_topics = User.objects.filter(
                selected_topics__topic__teacher=self.request.user
            ).distinct()
            qs = MidtermCheck.objects.filter(student__in=students_with_my_topics)
        else:
            return MidtermCheck.objects.none()
        
        # 支持按学生名称搜索
        query = self.request.query_params.get('username')
        if query:
            q = query.strip()
            qs = qs.annotate(student_full_name=Concat('student__last_name', 'student__first_name'))
            qs = qs.filter(
                Q(student__username__icontains=q) |
                Q(student__first_name__icontains=q) |
                Q(student__last_name__icontains=q) |
                Q(student_full_name__icontains=q)
            )
        return qs

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ProposalReviewAPIView(generics.CreateAPIView):
    serializer_class = ProposalReviewSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request, proposal_id, *args, **kwargs):
        if request.user.profile.role not in ['teacher', 'admin']:
            return Response({'detail': 'Only teachers can review proposals'}, status=status.HTTP_403_FORBIDDEN)
        try:
            Proposal.objects.get(id=proposal_id)
        except Proposal.DoesNotExist:
            return Response({'detail': 'Proposal not found'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data['proposal'] = proposal_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)


class MidtermReviewAPIView(generics.CreateAPIView):
    serializer_class = MidtermReviewSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def create(self, request, midterm_id, *args, **kwargs):
        if request.user.profile.role not in ['teacher', 'admin']:
            return Response({'detail': 'Only teachers can review midterms'}, status=status.HTTP_403_FORBIDDEN)
        try:
            MidtermCheck.objects.get(id=midterm_id)
        except MidtermCheck.DoesNotExist:
            return Response({'detail': 'Midterm not found'}, status=status.HTTP_404_NOT_FOUND)
        data = request.data.copy()
        data['midterm'] = midterm_id
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save(reviewer=self.request.user)


class TopicListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TopicSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # GET: students see all topics; teachers see their own topics
        user = self.request.user
        if user.profile.role == 'teacher':
            return Topic.objects.filter(teacher=user)
        # student or admin: show all topics
        return Topic.objects.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        # Only teachers may create topics
        if request.user.profile.role != 'teacher':
            return Response({'detail': 'Only teachers can create topics'}, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)


class TopicDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TopicSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        pk = self.kwargs.get('pk')
        try:
            return Topic.objects.get(id=pk)
        except Topic.DoesNotExist:
            return None

    def retrieve(self, request, *args, **kwargs):
        obj = self.get_object()
        if not obj:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(obj).data)

    def update(self, request, *args, **kwargs):
        obj = self.get_object()
        if not obj:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        # Only the owner teacher or admin can update
        if request.user != obj.teacher and request.user.profile.role != 'admin':
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        if not obj:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        # Prevent deletion if students have been selected
        if obj.selected_students and obj.selected_students > 0:
            return Response({'detail': 'Cannot delete topic with selected students'}, status=status.HTTP_400_BAD_REQUEST)
        if request.user != obj.teacher and request.user.profile.role != 'admin':
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TopicSelectAPIView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, pk, *args, **kwargs):
        # only students may select
        if request.user.profile.role != 'student':
            return Response({'detail': 'Only students can select topics'}, status=status.HTTP_403_FORBIDDEN)

        try:
            topic = Topic.objects.get(id=pk)
        except Topic.DoesNotExist:
            return Response({'detail': 'Topic not found'}, status=status.HTTP_404_NOT_FOUND)

        # check if student already selected any topic
        if TopicSelection.objects.filter(student=request.user).exists():
            return Response({'detail': '学生已选择过课题，不能重复选择'}, status=status.HTTP_400_BAD_REQUEST)

        # check capacity
        if topic.selected_students >= (topic.max_students or 1):
            return Response({'detail': '课题已满'}, status=status.HTTP_400_BAD_REQUEST)

        # create selection
        sel = TopicSelection.objects.create(topic=topic, student=request.user)
        # increment counter
        topic.selected_students = (topic.selected_students or 0) + 1
        topic.save()
        return Response({'detail': '选择成功'}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk, *args, **kwargs):
        # only students may deselect
        if request.user.profile.role != 'student':
            return Response({'detail': 'Only students can deselect topics'}, status=status.HTTP_403_FORBIDDEN)

        try:
            topic = Topic.objects.get(id=pk)
        except Topic.DoesNotExist:
            return Response({'detail': 'Topic not found'}, status=status.HTTP_404_NOT_FOUND)

        # find and delete the selection
        try:
            selection = TopicSelection.objects.get(topic=topic, student=request.user)
            selection.delete()
            # decrement counter
            topic.selected_students = max(0, (topic.selected_students or 1) - 1)
            topic.save()
            return Response({'detail': '取消选择成功'}, status=status.HTTP_200_OK)
        except TopicSelection.DoesNotExist:
            return Response({'detail': '未选择此课题'}, status=status.HTTP_400_BAD_REQUEST)


class MyTopicsListAPIView(generics.ListAPIView):
    serializer_class = TopicSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Only teachers can have topics
        if self.request.user.profile.role == 'teacher':
            return Topic.objects.filter(teacher=self.request.user)
        return Topic.objects.none()


class TopicStudentsAPIView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, *args, **kwargs):
        try:
            topic = Topic.objects.get(id=pk)
        except Topic.DoesNotExist:
            return Response({'detail': 'Topic not found'}, status=status.HTTP_404_NOT_FOUND)

        # Only topic owner or admin can view students
        if request.user != topic.teacher and request.user.profile.role != 'admin':
            return Response({'detail': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

        # Get all students who selected this topic
        selections = TopicSelection.objects.filter(topic=topic).select_related('student')
        students = []
        for sel in selections:
            first = getattr(sel.student, 'first_name', '') or ''
            last = getattr(sel.student, 'last_name', '') or ''
            full_name = (last + first).strip()
            if not full_name:
                full_name = sel.student.get_full_name().strip() or sel.student.username
            students.append({
                'id': sel.student.id,
                'student_id': sel.student.username,
                'name': full_name,
                'email': sel.student.email,
                'selected_at': sel.selected_at,
            })
        return Response({'students': students, 'count': len(students)}, status=status.HTTP_200_OK)
