from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, ProfileView, AvatarUploadView
from .views import (
    PasswordResetStartView,
    PasswordResetResendView,
    PasswordResetVerifyView,
    PasswordResetCompleteView,
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", TokenObtainPairView.as_view(), name="login"),      # username + password
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("me/", ProfileView.as_view(), name="me"),
    path("me/avatar/", AvatarUploadView.as_view(), name="avatar"),
    path("password-reset/start/", PasswordResetStartView.as_view()),
    path("password-reset/resend/", PasswordResetResendView.as_view()),
    path("password-reset/verify/", PasswordResetVerifyView.as_view()),
    path("password-reset/complete/", PasswordResetCompleteView.as_view()),
]
