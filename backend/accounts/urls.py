from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import SignupView, ProfileView, AvatarUploadView
from .views import (
    PasswordResetStartView,
    PasswordResetResendView,
    PasswordResetVerifyView,
    PasswordResetCompleteView,
    SignupView, ProfileView, AvatarUploadView,
    NotificationPreferenceView, AccountSettingView,
    ChangePasswordView, DeactivateAccountView, CloseAccountView,
    BalanceView, DashboardView, MyFundraisersView,
    FundraiserDetailView, FundraiserDonationsView, FundraiserCloseView
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
    path("settings/notifications/", NotificationPreferenceView.as_view()),
    path("settings/account/", AccountSettingView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),
    path("deactivate/", DeactivateAccountView.as_view()),
    path("close/", CloseAccountView.as_view()),
    path("balance/", BalanceView.as_view()),
    path("dashboard/", DashboardView.as_view()),
    path("dashboard/my-fundraisers/", MyFundraisersView.as_view()),
    path("fundraisers/<int:fundraiser_id>/", FundraiserDetailView.as_view()),
    path("fundraisers/<int:fundraiser_id>/donations/", FundraiserDonationsView.as_view()),
    path("fundraisers/<int:fundraiser_id>/close/", FundraiserCloseView.as_view()),
]
