from django.urls import path
from .views import (
    RegisterAPIView, LoginAPIView, MeAPIView,
    ThesisSubmitAPIView, ThesisDetailAPIView,
    StudentThesesListAPIView, AllThesesListAPIView,
    ThesisReviewAPIView,
    ProposalSubmitAPIView, MyProposalsListAPIView,
    AllProposalsListAPIView, ProposalReviewAPIView,
    MidtermSubmitAPIView, MyMidtermsListAPIView,
    AllMidtermsListAPIView, MidtermReviewAPIView,
    StudentProgressAPIView,
)
from .views import TopicListCreateAPIView, TopicDetailAPIView, MyTopicsListAPIView, TopicStudentsAPIView
from .views import TopicSelectAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('me/', MeAPIView.as_view(), name='me'),
    path('thesis/submit/', ThesisSubmitAPIView.as_view(), name='thesis_submit'),
    path('thesis/detail/', ThesisDetailAPIView.as_view(), name='thesis_detail'),
    path('thesis/my-thesis/', StudentThesesListAPIView.as_view(), name='my_thesis'),
    path('thesis/all-theses/', AllThesesListAPIView.as_view(), name='all_theses'),
    path('thesis/<int:thesis_id>/review/', ThesisReviewAPIView.as_view(), name='thesis_review'),
    # Proposal submission endpoints
    path('proposal/submit/', ProposalSubmitAPIView.as_view(), name='proposal_submit'),
    path('proposal/my-proposals/', MyProposalsListAPIView.as_view(), name='my_proposals'),
    path('proposal/all-proposals/', AllProposalsListAPIView.as_view(), name='all_proposals'),
    path('proposal/<int:proposal_id>/review/', ProposalReviewAPIView.as_view(), name='proposal_review'),
    # Midterm submission endpoints
    path('midterm/submit/', MidtermSubmitAPIView.as_view(), name='midterm_submit'),
    path('midterm/my-midterms/', MyMidtermsListAPIView.as_view(), name='my_midterms'),
    path('midterm/all-midterms/', AllMidtermsListAPIView.as_view(), name='all_midterms'),
    path('midterm/<int:midterm_id>/review/', MidtermReviewAPIView.as_view(), name='midterm_review'),
    # Topic endpoints for teacher topic management
    path('topics/my-topics/', MyTopicsListAPIView.as_view(), name='my_topics'),
    path('topics/', TopicListCreateAPIView.as_view(), name='topics_list_create'),
    path('topics/<int:pk>/', TopicDetailAPIView.as_view(), name='topic_detail'),
    path('topics/<int:pk>/select/', TopicSelectAPIView.as_view(), name='topic_select'),
    path('topics/<int:pk>/students/', TopicStudentsAPIView.as_view(), name='topic_students'),
    # Student progress endpoint
    path('progress/', StudentProgressAPIView.as_view(), name='student_progress'),
]
