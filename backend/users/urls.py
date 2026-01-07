from django.urls import path
from .views import (
    RegisterAPIView, LoginAPIView, MeAPIView,
    ThesisSubmitAPIView, ThesisDetailAPIView,
    StudentThesesListAPIView, AllThesesListAPIView,
    ThesisReviewAPIView
)

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('me/', MeAPIView.as_view(), name='me'),
    path('thesis/submit/', ThesisSubmitAPIView.as_view(), name='thesis_submit'),
    path('thesis/detail/', ThesisDetailAPIView.as_view(), name='thesis_detail'),
    path('thesis/my-thesis/', StudentThesesListAPIView.as_view(), name='my_thesis'),
    path('thesis/all-theses/', AllThesesListAPIView.as_view(), name='all_theses'),
    path('thesis/<int:thesis_id>/review/', ThesisReviewAPIView.as_view(), name='thesis_review'),
]
