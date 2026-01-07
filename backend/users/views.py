from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import MultiPartParser, FormParser

from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, ThesisSerializer, ThesisReviewSerializer
from .models import Thesis, ThesisReview
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
        # Only teachers and admins can see all theses
        if self.request.user.profile.role in ['teacher', 'admin']:
            qs = Thesis.objects.all()
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
        return Thesis.objects.none()

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


class TopicListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = TopicSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # For now, return topics owned by the current user when listing
        return Topic.objects.filter(teacher=self.request.user)

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


class MyTopicsListAPIView(generics.ListAPIView):
    serializer_class = TopicSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        # Only teachers can have topics
        if self.request.user.profile.role == 'teacher':
            return Topic.objects.filter(teacher=self.request.user)
        return Topic.objects.none()
