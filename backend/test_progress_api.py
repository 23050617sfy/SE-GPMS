#!/usr/bin/env python
"""
Test script for Student Progress API.
Run: python manage.py shell < test_progress_api.py
"""

from users.models import (
    User, Topic, TopicSelection, Proposal, MidtermCheck, Thesis,
    ProposalReview, MidtermReview, ThesisReview
)
from users.views import StudentProgressAPIView
from rest_framework.test import APIRequestFactory
from rest_framework.authtoken.models import Token
import json

print("\n" + "="*60)
print("STUDENT PROGRESS API TEST")
print("="*60 + "\n")

# Create test users
student, _ = User.objects.get_or_create(
    username='test_student_progress',
    defaults={
        'email': 'student_progress@test.com',
        'first_name': '进度',
        'last_name': '测试'
    }
)

teacher, _ = User.objects.get_or_create(
    username='test_teacher_progress',
    defaults={
        'email': 'teacher_progress@test.com',
        'first_name': '教',
        'last_name': '师'
    }
)

# Set roles
if hasattr(student, 'profile'):
    student.profile.role = 'student'
    student.profile.save()

if hasattr(teacher, 'profile'):
    teacher.profile.role = 'teacher'
    teacher.profile.save()

print(f"✓ Created/found test users:")
print(f"  - Student: {student.username}")
print(f"  - Teacher: {teacher.username}\n")

# Create a topic
topic, _ = Topic.objects.get_or_create(
    teacher=teacher,
    title='测试课题：机器学习应用',
    defaults={
        'type': '应用研究',
        'difficulty': '中等',
        'max_students': 2,
        'description': '研究机器学习在实际场景中的应用'
    }
)

print(f"✓ Created/found topic: {topic.title}\n")

# Create topic selection
selection, created = TopicSelection.objects.get_or_create(
    topic=topic,
    student=student
)
if created:
    topic.selected_students = topic.selected_students + 1
    topic.save()
    print(f"✓ Student selected topic: {topic.title}\n")
else:
    print(f"✓ Student already selected topic: {topic.title}\n")

# Create proposal
proposal, created = Proposal.objects.get_or_create(
    student=student,
    defaults={
        'title': '基于深度学习的图像识别系统',
    }
)
print(f"✓ Created/found proposal: {proposal.title}\n")

# Create proposal review
proposal_review, created = ProposalReview.objects.get_or_create(
    proposal=proposal,
    reviewer=teacher,
    defaults={
        'result': 'pass',
        'score': 85,
        'feedback': '开题报告内容充实，研究方向明确。'
    }
)
print(f"✓ Created/found proposal review: {proposal_review.result} ({proposal_review.score}分)\n")

# Create midterm check
midterm, created = MidtermCheck.objects.get_or_create(
    student=student,
    defaults={
        'title': '中期检查',
    }
)
print(f"✓ Created/found midterm check\n")

# Create midterm review
midterm_review, created = MidtermReview.objects.get_or_create(
    midterm=midterm,
    reviewer=teacher,
    defaults={
        'result': 'pass',
        'score': 88,
        'feedback': '进度良好，按计划推进。'
    }
)
print(f"✓ Created/found midterm review: {midterm_review.result} ({midterm_review.score}分)\n")

# Create thesis (first review)
thesis_first, created = Thesis.objects.get_or_create(
    student=student,
    stage='first_review',
    defaults={
        'title': '基于深度学习的图像识别系统研究',
        'status': 'first_review'
    }
)
print(f"✓ Created/found thesis (first review)\n")

# Create thesis review (first)
thesis_review_first, created = ThesisReview.objects.get_or_create(
    thesis=thesis_first,
    reviewer=teacher,
    stage='first_review',
    defaults={
        'result': 'revise',
        'score': 78,
        'feedback': '论文结构完整，但实验部分需要补充更多数据分析。'
    }
)
print(f"✓ Created/found thesis review (first): {thesis_review_first.result} ({thesis_review_first.score}分)\n")

# Test the API
print("="*60)
print("TESTING PROGRESS API")
print("="*60 + "\n")

factory = APIRequestFactory()
token, _ = Token.objects.get_or_create(user=student)

request = factory.get('/api/auth/progress/')
request.user = student
request.auth = token

# Manually set authentication to bypass token requirement for testing
from rest_framework.test import force_authenticate
force_authenticate(request, user=student, token=token)

view = StudentProgressAPIView.as_view()
response = view(request)

print(f"Response status: {response.status_code}")
print(f"\nResponse data:")
print(json.dumps(response.data, indent=2, ensure_ascii=False))

print("\n" + "="*60)
print("TEST COMPLETED")
print("="*60 + "\n")
