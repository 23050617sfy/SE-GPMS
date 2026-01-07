#!/usr/bin/env python
"""
Test script for Proposal and Midterm review functionality.
Run: python manage.py shell < test_reviews.py
"""

from users.models import User, Proposal, MidtermCheck, ProposalReview, MidtermReview
from users.serializers import ProposalSerializer, MidtermCheckSerializer
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory
import json

print("\n" + "="*60)
print("PROPOSAL AND MIDTERM REVIEW TEST")
print("="*60 + "\n")

# Create test users
student, _ = User.objects.get_or_create(
    username='test_student',
    defaults={
        'email': 'student@test.com',
        'first_name': '学',
        'last_name': '生'
    }
)

teacher, _ = User.objects.get_or_create(
    username='test_teacher',
    defaults={
        'email': 'teacher@test.com',
        'first_name': '教',
        'last_name': '师'
    }
)

# Set roles if profile exists
if hasattr(student, 'profile'):
    student.profile.role = 'student'
    student.profile.save()

if hasattr(teacher, 'profile'):
    teacher.profile.role = 'teacher'
    teacher.profile.save()

print(f"✓ Created/found test users:")
print(f"  - Student: {student.username}")
print(f"  - Teacher: {teacher.username}\n")

# Create or get a proposal
proposal, created = Proposal.objects.get_or_create(
    student=student,
    defaults={
        'title': '测试开题报告',
        'file': 'test_proposal.pdf',
        'status': 'submitted'
    }
)
print(f"{'✓ Created' if created else '✓ Found'} Proposal: {proposal.id}")
print(f"  - Title: {proposal.title}")
print(f"  - Student: {proposal.student.username}")
print(f"  - Status: {proposal.status}\n")

# Create or update a proposal review
review, created = ProposalReview.objects.get_or_create(
    proposal=proposal,
    reviewer=teacher,
    defaults={
        'feedback': '这是一份不错的开题报告，继续加油！',
        'score': 85,
        'result': 'pass'
    }
)
if not created:
    review.feedback = '这是一份不错的开题报告，继续加油！'
    review.score = 85
    review.result = 'pass'
    review.save()

print(f"{'✓ Created' if created else '✓ Updated'} ProposalReview: {review.id}")
print(f"  - Reviewer: {review.reviewer.username}")
print(f"  - Feedback: {review.feedback}")
print(f"  - Score: {review.score}")
print(f"  - Result: {review.result}\n")

# Test serializer
print("="*60)
print("TESTING SERIALIZERS")
print("="*60 + "\n")

# Create request factory for context
factory = RequestFactory()
request = factory.get('/api/auth/proposal/my-proposals/')

# Test ProposalSerializer
print("Testing ProposalSerializer:")
serializer = ProposalSerializer(proposal, context={'request': request})
proposal_data = serializer.data
print(f"  - Serialized data keys: {list(proposal_data.keys())}")
print(f"  - Has 'reviews': {'reviews' in proposal_data}")
if 'reviews' in proposal_data:
    print(f"  - Reviews count: {len(proposal_data['reviews'])}")
    if proposal_data['reviews']:
        for idx, rev in enumerate(proposal_data['reviews']):
            print(f"    Review {idx}:")
            print(f"      - ID: {rev.get('id')}")
            print(f"      - Reviewer: {rev.get('reviewer_name')}")
            print(f"      - Feedback: {rev.get('feedback')}")
            print(f"      - Score: {rev.get('score')}")
            print(f"      - Result: {rev.get('result')}")
            print(f"      - Reviewed at: {rev.get('reviewed_at')}\n")
else:
    print("  ✗ 'reviews' field missing!\n")

# Create or get a midterm check
midterm, created = MidtermCheck.objects.get_or_create(
    student=student,
    defaults={
        'title': '测试中期检查',
        'file': 'test_midterm.pdf',
        'status': 'submitted'
    }
)
print(f"{'✓ Created' if created else '✓ Found'} MidtermCheck: {midterm.id}")
print(f"  - Title: {midterm.title}")
print(f"  - Student: {midterm.student.username}")
print(f"  - Status: {midterm.status}\n")

# Create or update a midterm review
mreview, created = MidtermReview.objects.get_or_create(
    midterm=midterm,
    reviewer=teacher,
    defaults={
        'feedback': '中期进度良好，请继续按计划进行。',
        'score': 90,
        'result': 'pass'
    }
)
if not created:
    mreview.feedback = '中期进度良好，请继续按计划进行。'
    mreview.score = 90
    mreview.result = 'pass'
    mreview.save()

print(f"{'✓ Created' if created else '✓ Updated'} MidtermReview: {mreview.id}")
print(f"  - Reviewer: {mreview.reviewer.username}")
print(f"  - Feedback: {mreview.feedback}")
print(f"  - Score: {mreview.score}")
print(f"  - Result: {mreview.result}\n")

# Test MidtermCheckSerializer
print("Testing MidtermCheckSerializer:")
serializer = MidtermCheckSerializer(midterm, context={'request': request})
midterm_data = serializer.data
print(f"  - Serialized data keys: {list(midterm_data.keys())}")
print(f"  - Has 'reviews': {'reviews' in midterm_data}")
if 'reviews' in midterm_data:
    print(f"  - Reviews count: {len(midterm_data['reviews'])}")
    if midterm_data['reviews']:
        for idx, rev in enumerate(midterm_data['reviews']):
            print(f"    Review {idx}:")
            print(f"      - ID: {rev.get('id')}")
            print(f"      - Reviewer: {rev.get('reviewer_name')}")
            print(f"      - Feedback: {rev.get('feedback')}")
            print(f"      - Score: {rev.get('score')}")
            print(f"      - Result: {rev.get('result')}")
            print(f"      - Reviewed at: {rev.get('reviewed_at')}\n")
else:
    print("  ✗ 'reviews' field missing!\n")

# Verify database relationships
print("="*60)
print("VERIFYING DATABASE RELATIONSHIPS")
print("="*60 + "\n")

print(f"Proposal.reviews.all(): {proposal.reviews.all()}")
print(f"Midterm.reviews.all(): {midterm.reviews.all()}\n")

# Check related names
print("Checking related names (reverse relations):")
print(f"Proposal.reviews.all(): {list(proposal.reviews.all())}")
print(f"MidtermCheck.reviews.all(): {list(midterm.reviews.all())}\n")

print("="*60)
print("✓ ALL TESTS COMPLETED")
print("="*60 + "\n")

print("JSON Output for verification:")
print("Proposal (with reviews):")
print(json.dumps(proposal_data, indent=2, ensure_ascii=False, default=str))
print("\nMidterm (with reviews):")
print(json.dumps(midterm_data, indent=2, ensure_ascii=False, default=str))
