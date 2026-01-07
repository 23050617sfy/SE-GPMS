from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import OperationalError


class Profile(models.Model):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
    )
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    def __str__(self):
        return f'{self.user.username} profile'


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        try:
            Profile.objects.create(user=instance)
        except OperationalError:
            # Database tables may not be created yet (e.g. before running migrations).
            # Swallow the error so management commands like `createsuperuser`
            # can proceed; profile will be created later when appropriate.
            pass


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        if hasattr(instance, 'profile'):
            instance.profile.save()
    except OperationalError:
        # If the profile table does not exist yet, ignore.
        pass


class Thesis(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('first_review', 'First Review'),
        ('first_pass', 'First Review Pass'),
        ('first_fail', 'First Review Fail'),
        ('second_review', 'Second Review'),
        ('second_pass', 'Second Review Pass'),
        ('second_fail', 'Second Review Fail'),
        ('final', 'Final'),
    )

    STAGE_CHOICES = (
        ('first_review', 'First Review'),
        ('second_review', 'Second Review'),
        ('final_submission', 'Final Submission'),
    )

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='theses')
    title = models.CharField(max_length=255)
    file = models.FileField(upload_to='thesis/%Y/%m/')
    version = models.CharField(max_length=50, default='draft')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    stage = models.CharField(max_length=30, choices=STAGE_CHOICES, default='first_review')
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.student.username} - {self.title}'

    class Meta:
        ordering = ['-submitted_at']


class ThesisReview(models.Model):
    REVIEW_RESULT_CHOICES = (
        ('pass', 'Pass'),
        ('fail', 'Fail'),
        ('revise', 'Revise Required'),
    )

    thesis = models.ForeignKey(Thesis, on_delete=models.CASCADE, related_name='reviews')
    reviewer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reviews')
    stage = models.CharField(max_length=30)
    feedback = models.TextField(blank=True, null=True)
    score = models.IntegerField(null=True, blank=True)
    result = models.CharField(max_length=20, choices=REVIEW_RESULT_CHOICES)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review of {self.thesis.student.username} - {self.stage}'

    class Meta:
        ordering = ['-reviewed_at']


class Topic(models.Model):
    TYPE_CHOICES = (
        ('应用研究', '应用研究'),
        ('理论研究', '理论研究'),
        ('系统设计', '系统设计'),
        ('算法设计', '算法设计'),
    )

    DIFFICULTY_CHOICES = (
        ('较易', '较易'),
        ('中等', '中等'),
        ('较难', '较难'),
    )

    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='topics')
    title = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='应用研究')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='中等')
    max_students = models.IntegerField(default=1)
    # number of students already selected/assigned for this topic
    selected_students = models.IntegerField(default=0)
    description = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.teacher.username} - {self.title}'

    class Meta:
        ordering = ['-created_at']


class TopicSelection(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name='selections')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='selected_topics')
    selected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('topic', 'student')

    def __str__(self):
        return f'{self.student.username} -> {self.topic.title}'
