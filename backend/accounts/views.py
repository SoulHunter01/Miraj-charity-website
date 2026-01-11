import random
import uuid
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum

from .serializers import SignupSerializer, ProfileSerializer, DonationSerializer
from .models import NotificationPreference, AccountSetting, Donation
from .serializers import (
    NotificationPreferenceSerializer,
    AccountSettingSerializer,
    ChangePasswordSerializer,
)

class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(ProfileSerializer(request.user).data)

    def patch(self, request):
        # For phone/cnic updates
        serializer = ProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file = request.FILES.get("avatar")
        if not file:
            return Response({"message": "avatar file is required"}, status=400)

        request.user.avatar = file
        request.user.save()
        return Response(ProfileSerializer(request.user).data)

User = get_user_model()
OTP_TTL = 300

def _otp_key(reset_id): 
    return f"pwreset:{reset_id}"

def _token_key(reset_id): 
    return f"pwreset_token:{reset_id}"

class PasswordResetStartView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        method = request.data.get("method")      # "email" or "phone"
        destination = (request.data.get("destination") or "").strip()

        if method not in ["email", "phone"] or not destination:
            return Response({"message": "Invalid request."}, status=400)

        if method == "email":
            user = User.objects.filter(email__iexact=destination).first()
        else:
            user = User.objects.filter(phone=destination).first()

        reset_id = str(uuid.uuid4())
        code = f"{random.randint(0, 999999):06d}"

        cache.set(_otp_key(reset_id), {"code": code, "user_id": user.id if user else None}, OTP_TTL)
        print(f"[PasswordReset] method={method} destination={destination} reset_id={reset_id} code={code}")

        return Response({"reset_id": reset_id, "expires_in": OTP_TTL})

class PasswordResetResendView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        reset_id = request.data.get("reset_id")
        if not reset_id:
            return Response({"message": "reset_id required."}, status=400)

        info = cache.get(_otp_key(reset_id))
        if not info:
            return Response({"message": "Reset session expired. Start again."}, status=400)

        code = f"{random.randint(0, 999999):06d}"
        info["code"] = code
        cache.set(_otp_key(reset_id), info, OTP_TTL)
        print(f"[PasswordReset] resend reset_id={reset_id} code={code}")

        return Response({"expires_in": OTP_TTL})

class PasswordResetVerifyView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        reset_id = request.data.get("reset_id")
        code = (request.data.get("code") or "").strip()

        info = cache.get(_otp_key(reset_id))
        if not info:
            return Response({"message": "Code expired. Please resend."}, status=400)
        if info["code"] != code:
            return Response({"message": "Invalid code."}, status=400)

        reset_token = str(uuid.uuid4())
        cache.set(_token_key(reset_id), {"token": reset_token, "user_id": info["user_id"]}, 600)
        return Response({"reset_token": reset_token})

class PasswordResetCompleteView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        reset_id = request.data.get("reset_id")
        reset_token = request.data.get("reset_token")
        new_password = request.data.get("new_password")

        token_info = cache.get(_token_key(reset_id))
        if not token_info or token_info["token"] != reset_token:
            return Response({"message": "Invalid or expired reset session."}, status=400)

        user_id = token_info.get("user_id")
        if not user_id:
            return Response({"message": "Account not found."}, status=400)

        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"message": "Account not found."}, status=400)

        user.set_password(new_password)
        user.save()

        cache.delete(_otp_key(reset_id))
        cache.delete(_token_key(reset_id))
        return Response({"message": "Password reset successful."})

class NotificationPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pref, _ = NotificationPreference.objects.get_or_create(user=request.user)
        return Response(NotificationPreferenceSerializer(pref).data)

    def patch(self, request):
        pref, _ = NotificationPreference.objects.get_or_create(user=request.user)
        ser = NotificationPreferenceSerializer(pref, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)


class AccountSettingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        setting, _ = AccountSetting.objects.get_or_create(user=request.user)
        return Response(AccountSettingSerializer(setting).data)

    def patch(self, request):
        setting, _ = AccountSetting.objects.get_or_create(user=request.user)
        ser = AccountSettingSerializer(setting, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = ChangePasswordSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        if not request.user.check_password(ser.validated_data["current_password"]):
            return Response({"detail": "Current password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(ser.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Password updated successfully."})


class DeactivateAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get("password", "")
        choice = request.data.get("funds_allocation_choice", "")

        if not request.user.check_password(password):
            return Response({"detail": "Password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        setting, _ = AccountSetting.objects.get_or_create(user=request.user)
        if choice:
            setting.funds_allocation_choice = choice

        setting.is_deactivated = True
        setting.save()

        # also disable login
        request.user.is_active = False
        request.user.save()

        return Response({"detail": "Account deactivated successfully."})


class CloseAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        password = request.data.get("password", "")
        choice = request.data.get("funds_allocation_choice", "")

        if not request.user.check_password(password):
            return Response({"detail": "Password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

        setting, _ = AccountSetting.objects.get_or_create(user=request.user)
        if choice:
            setting.funds_allocation_choice = choice

        setting.is_closed = True
        setting.save()

        request.user.is_active = False
        request.user.save()

        return Response({"detail": "Account closed successfully."})

class BalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Donation.objects.filter(recipient=request.user).order_by("-created_at")

        total = qs.filter(status=Donation.STATUS_RECEIVED).aggregate(
            total=Sum("amount")
        )["total"] or 0

        return Response({
            "total_balance": str(total),
            "donations": DonationSerializer(qs[:50], many=True).data
        })