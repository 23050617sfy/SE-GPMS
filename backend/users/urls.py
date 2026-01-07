from django.urls import path
from .views import (
    RegisterAPIView, LoginAPIView, MeAPIView,
    ThesisSubmitAPIView, ThesisDetailAPIView,
    StudentThesesListAPIView, AllThesesListAPIView,
    ThesisReviewAPIView
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
    # Topic endpoints for teacher topic management
    path('topics/my-topics/', MyTopicsListAPIView.as_view(), name='my_topics'),
    path('topics/', TopicListCreateAPIView.as_view(), name='topics_list_create'),
    path('topics/<int:pk>/', TopicDetailAPIView.as_view(), name='topic_detail'),
    path('topics/<int:pk>/select/', TopicSelectAPIView.as_view(), name='topic_select'),
    path('topics/<int:pk>/students/', TopicStudentsAPIView.as_view(), name='topic_students'),
]
