from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile, Thesis, ThesisReview


class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role', read_only=True)
    student_id = serializers.CharField(source='username', read_only=True)

    class Meta:
        model = User
        fields = ('student_id', 'email', 'role')


class RegisterSerializer(serializers.Serializer):
    student_id = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=[('student','Student'),('teacher','Teacher'),('admin','Admin')])
    password = serializers.CharField(write_only=True, min_length=6)

    def validate_student_id(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('student_id already exists')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('email already exists')
        return value

    def create(self, validated_data):
        student_id = validated_data['student_id']
        email = validated_data['email']
        role = validated_data['role']
        password = validated_data['password']

        user = User.objects.create_user(username=student_id, email=email, password=password)
        user.profile.role = role
        user.profile.save()
        return user


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()  # student_id or email
    password = serializers.CharField(write_only=True)


class ThesisReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.first_name', read_only=True)
    thesis = serializers.PrimaryKeyRelatedField(queryset=Thesis.objects.all(), write_only=True)

    class Meta:
        model = ThesisReview
        fields = ('id', 'thesis', 'stage', 'feedback', 'score', 'result', 'reviewed_at', 'reviewer_name')
        read_only_fields = ('id', 'reviewed_at')

    def validate_score(self, value):
        if value is None:
            return value
        if value < 0 or value > 100:
            raise serializers.ValidationError('score must be between 0 and 100')
        return value

    def validate_stage(self, value):
        allowed = ['first_review', 'second_review', 'final_submission']
        if value not in allowed:
            raise serializers.ValidationError('invalid stage')
        return value


class ThesisSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_id = serializers.CharField(source='student.username', read_only=True)
    reviews = ThesisReviewSerializer(many=True, read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Thesis
        fields = ('id', 'student_id', 'student_name', 'title', 'file', 'file_url', 'version', 'status', 'stage', 'submitted_at', 'updated_at', 'reviews')
        read_only_fields = ('id', 'submitted_at', 'updated_at')

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

    def get_student_name(self, obj):
        # For Chinese names prefer last_name + first_name without space
        first = getattr(obj.student, 'first_name', '') or ''
        last = getattr(obj.student, 'last_name', '') or ''
        full = (last + first).strip()
        if full:
            return full
        # fallback to get_full_name or username
        full_name = obj.student.get_full_name().strip()
        if full_name:
            return full_name
        return obj.student.username
