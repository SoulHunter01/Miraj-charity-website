import random
import uuid
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Count, Q, Max
from django.db.models import Value, IntegerField
from django.shortcuts import get_object_or_404
from django.db.models.functions import Coalesce
from decimal import Decimal
from django.core.files.storage import default_storage
from django.utils import timezone
from django.db import transaction

from .serializers import SignupSerializer, ProfileSerializer, DonationSerializer
from .models import NotificationPreference, AccountSetting, Fundraiser, Donation, FundraiserDocument, FundraiserPayout
from .serializers import (
    NotificationPreferenceSerializer,
    AccountSettingSerializer,
    ChangePasswordSerializer,
    FundraiserListSerializer,
    FundraiserDetailSerializer, FundraiserDonationSerializer,
    FundraiserEditSerializer, FundraiserDocumentSerializer,
    StartFundraiserSerializer, FundraiserStartDetailsSerializer,
    FundraiserBasicSerializer, FundraiserLinkOptionSerializer,
    FundraiserPayoutSetupSerializer, FeaturedFundraiserSerializer,
    DiscoverFundraiserSerializer, PublicFundraiserDetailSerializer,
    PublicDonationListSerializer,
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

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Fundraisers owned by user
        fundraisers = Fundraiser.objects.filter(owner=request.user)
        fr_total = fundraisers.aggregate(total=Sum("collected_amount"))["total"] or 0
        fr_active = fundraisers.filter(status=Fundraiser.STATUS_ACTIVE).count()
        fr_closed = fundraisers.filter(status=Fundraiser.STATUS_CLOSED).count()

        # Donations made by user (donor=request.user)
        donations_made = Donation.objects.filter(donor=request.user)
        dn_total = donations_made.aggregate(total=Sum("amount"))["total"] or 0

        # For "Active/Closed" under My Donations, we treat:
        # active = donations to active fundraisers, closed = donations to closed fundraisers
        # If you don’t have donation->fundraiser relation yet, we’ll just return 0/0.
        dn_active = 0
        dn_closed = 0

        return Response({
            "my_fundraisers": {
                "collected_amount": str(fr_total),
                "active": fr_active,
                "closed": fr_closed,
            },
            "my_donations": {
                "total_donated": str(dn_total),
                "active": dn_active,
                "closed": dn_closed,
            }
        })

class MyFundraisersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        status_param = (request.query_params.get("status") or "").strip().lower()
        q = (request.query_params.get("q") or "").strip()
        sort = (request.query_params.get("sort") or "newest").strip().lower()

        # ✅ annotate real totals from donations
        qs = (
                Fundraiser.objects
                .filter(owner=request.user)
                .annotate(
                    collected_amount_real=Coalesce(
                        Sum(
                            "donations__amount",
                            filter=Q(donations__status=Donation.STATUS_RECEIVED)
                        ),
                        Decimal("0.00")
                    ),
                    donations_count=Coalesce(
                        Count(
                            "donations",
                            filter=Q(donations__status=Donation.STATUS_RECEIVED)
                        ),
                        0
                    )
                )
            )

        if status_param in ["active", "closed", "draft"]:
            qs = qs.filter(status=status_param)

        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(id__icontains=q))

        # ✅ sort using the annotated field (NOT Fundraiser.collected_amount)
        sort_map = {
            "newest": "-created_at",
            "oldest": "created_at",
            "deadline_asc": "deadline",
            "deadline_desc": "-deadline",
            "collected_desc": "-collected_amount_real",
            "collected_asc": "collected_amount_real",
            "target_desc": "-target_amount",
            "target_asc": "target_amount",
        }
        qs = qs.order_by(sort_map.get(sort, "-created_at"))

        return Response(FundraiserListSerializer(qs, many=True).data)

class FundraiserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, fundraiser_id):
        fundraiser = (
            Fundraiser.objects
            .filter(id=fundraiser_id, owner=request.user)
            .annotate(
                collected_amount_real=Coalesce(
                    Sum(
                        "donations__amount",
                        filter=Q(donations__status=Donation.STATUS_RECEIVED)
                    ),
                    Decimal("0.00")
                )
            )
            .first()
        )

        if not fundraiser:
            return Response({"detail": "Not found"}, status=404)

        data = FundraiserDetailSerializer(fundraiser).data

        # ✅ override static collected_amount with real one
        data["collected_amount"] = str(fundraiser.collected_amount_real)

        return Response(data)


class FundraiserDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        qs = Donation.objects.filter(fundraiser=fundraiser).order_by("-created_at")
        return Response(FundraiserDonationSerializer(qs, many=True).data)


class FundraiserCloseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        fundraiser.status = Fundraiser.STATUS_CLOSED
        fundraiser.save()
        return Response({"detail": "Fundraiser closed successfully."}, status=status.HTTP_200_OK)

class FundraiserEditView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        return Response(FundraiserEditSerializer(fundraiser).data)

    def patch(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        ser = FundraiserEditSerializer(fundraiser, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(FundraiserEditSerializer(fundraiser).data)


class FundraiserCoverUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        file = request.FILES.get("image")
        if not file:
            return Response({"detail": "image is required"}, status=400)

        fundraiser.image = file
        fundraiser.save()
        return Response(FundraiserEditSerializer(fundraiser).data)


class FundraiserDocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        file = request.FILES.get("file")
        if not file:
            return Response({"detail": "file is required"}, status=400)

        doc = FundraiserDocument.objects.create(fundraiser=fundraiser, file=file)
        return Response(FundraiserDocumentSerializer(doc).data, status=status.HTTP_201_CREATED)


class FundraiserDocumentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, fundraiser_id, doc_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        doc = get_object_or_404(FundraiserDocument, id=doc_id, fundraiser=fundraiser)
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class MyDonationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        q = (request.query_params.get("q") or "").strip()
        sort = (request.query_params.get("sort") or "latest").strip().lower()

        # donations made by this user (must be linked to fundraiser)
        qs = Donation.objects.filter(donor=request.user, fundraiser__isnull=False)

        if q:
            qs = qs.filter(fundraiser__title__icontains=q)

        grouped = (
            qs.values(
                "fundraiser_id",
                "fundraiser__title",
                "fundraiser__image",
                "fundraiser__owner__username",
                "fundraiser__target_amount",
            )
            .annotate(
                # total donated by this user to this fundraiser
                total_donated=Coalesce(Sum("amount"), Decimal("0.00")),
                last_donation=Max("created_at"),
                frequency_label=Max("frequency_label"),

                # ✅ real collected by fundraiser from ALL received donations
                collected_real=Coalesce(
                    Sum(
                        "fundraiser__donations__amount",
                        filter=Q(fundraiser__donations__status=Donation.STATUS_RECEIVED),
                    ),
                    Decimal("0.00"),
                ),
            )
        )

        # sort
        if sort == "latest":
            grouped = grouped.order_by("-last_donation")
        elif sort == "most":
            grouped = grouped.order_by("-total_donated")
        elif sort == "least":
            grouped = grouped.order_by("total_donated")
        else:
            grouped = grouped.order_by("-last_donation")

        out = []
        for row in grouped:
            target = row["fundraiser__target_amount"] or Decimal("0.00")
            collected = row["collected_real"] or Decimal("0.00")
            left = target - collected
            if left < 0:
                left = Decimal("0.00")

            # ✅ image path in values can be "fundraisers/xxx.png" or "/media/..."
            img = row["fundraiser__image"] or ""
            if img:
                img = default_storage.url(img)

            out.append({
                "fundraiser_id": row["fundraiser_id"],
                "title": row["fundraiser__title"],
                "image": img,
                "published_by": row["fundraiser__owner__username"] or "",
                "total_donated": str(row["total_donated"]),
                "frequency_label": row["frequency_label"] or "",
                "left": str(left),
                "last_donation": row["last_donation"],
            })

        return Response(out)

class FundraiserStartDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        ser = FundraiserStartDetailsSerializer(fundraiser, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

class StartFundraiserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        ser = StartFundraiserSerializer(data=request.data, context={"request": request})
        ser.is_valid(raise_exception=True)
        fundraiser = ser.save()
        return Response({"id": fundraiser.id}, status=status.HTTP_201_CREATED)

class FundraiserBasicView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        ser = FundraiserBasicSerializer(fundraiser, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

class FundraiserDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)
        ser = FundraiserDetailsSerializer(fundraiser, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

class MyActiveFundraisersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = (
            Fundraiser.objects
            .filter(owner=request.user, status=Fundraiser.STATUS_ACTIVE)
            .annotate(
                collected_amount_real=Coalesce(
                    Sum(
                        "donations__amount",
                        filter=Q(donations__status=Donation.STATUS_RECEIVED)
                    ),
                    Decimal("0.00")
                ),
                donations_count=Coalesce(
                    Count(
                        "donations",
                        filter=Q(donations__status=Donation.STATUS_RECEIVED)
                    ),
                    0
                )
            )
            .order_by("-created_at")
        )

        return Response(FundraiserLinkOptionSerializer(qs, many=True).data)

class FundraiserLinkPreviousView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)

        linked_id = request.data.get("linked_fundraiser_id", None)

        if linked_id in ["", None]:
            fundraiser.linked_fundraiser = None
            fundraiser.save(update_fields=["linked_fundraiser"])
            return Response({"linked_fundraiser_id": None})

        # ensure the linked fundraiser is ACTIVE and belongs to the same user
        linked = get_object_or_404(
            Fundraiser,
            id=linked_id,
            owner=request.user,
            status=Fundraiser.STATUS_ACTIVE
        )

        # prevent linking to itself
        if linked.id == fundraiser.id:
            return Response({"detail": "Cannot link fundraiser to itself."}, status=400)

        fundraiser.linked_fundraiser = linked
        fundraiser.save(update_fields=["linked_fundraiser"])

        return Response({"linked_fundraiser_id": linked.id})

class FundraiserPayoutSetupView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)

        payouts = FundraiserPayout.objects.filter(fundraiser=fundraiser).order_by("method")
        payout_methods = []
        for p in payouts:
            payload = {
                "method": p.method,
                "is_enabled": p.is_enabled,
                "bank_account_title": p.bank_account_title,
                "bank_account_number": p.bank_account_number,
                "bank_iban": p.bank_iban,
                "bank_raast_id": p.bank_raast_id,
                "phone_number": p.phone_number,
            }
            payout_methods.append(payload)

        return Response({
            "reimbursement_period": fundraiser.reimbursement_period,
            "payout_methods": payout_methods
        })

    def patch(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)

        ser = FundraiserPayoutSetupSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data

        # update reimbursement period
        if "reimbursement_period" in data:
            fundraiser.reimbursement_period = data.get("reimbursement_period") or ""
            fundraiser.save(update_fields=["reimbursement_period"])

        # upsert payout methods
        for m in data["payout_methods"]:
            obj, _ = FundraiserPayout.objects.get_or_create(
                fundraiser=fundraiser,
                method=m["method"],
            )
            obj.is_enabled = m["is_enabled"]

            if m["method"] == "bank":
                obj.bank_account_title = m.get("bank_account_title", "")
                obj.bank_account_number = m.get("bank_account_number", "")
                obj.bank_iban = m.get("bank_iban", "")
                obj.bank_raast_id = m.get("bank_raast_id", "")
                obj.phone_number = ""
            else:
                obj.phone_number = m.get("phone_number", "")
                obj.bank_account_title = ""
                obj.bank_account_number = ""
                obj.bank_iban = ""
                obj.bank_raast_id = ""

            obj.save()

        return Response({"detail": "Saved"})

class FundraiserPublishView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, fundraiser_id):
        fundraiser = get_object_or_404(Fundraiser, id=fundraiser_id, owner=request.user)

        # must have at least one enabled payout method
        enabled = FundraiserPayout.objects.filter(fundraiser=fundraiser, is_enabled=True).exists()
        if not enabled:
            return Response({"detail": "Select at least one payout method."}, status=400)

        # basic minimum validations (extend later)
        if not fundraiser.title.strip():
            return Response({"detail": "Title is required."}, status=400)
        if not fundraiser.location.strip():
            return Response({"detail": "Location is required."}, status=400)
        if not fundraiser.category.strip():
            return Response({"detail": "Category is required."}, status=400)
        if fundraiser.target_amount <= 0:
            return Response({"detail": "Target amount must be greater than 0."}, status=400)
        if not fundraiser.deadline:
            return Response({"detail": "Deadline is required."}, status=400)

        fundraiser.status = Fundraiser.STATUS_ACTIVE
        fundraiser.published_at = timezone.now()
        fundraiser.save(update_fields=["status", "published_at"])

        return Response({
        "id": fundraiser.id,
        "title": fundraiser.title,
        "image": fundraiser.image.url if fundraiser.image else "",
        "status": fundraiser.status,
    })

class FeaturedFundraisersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        limit = int(request.query_params.get("limit", 12))

        qs = (
            Fundraiser.objects
            .filter(status=Fundraiser.STATUS_ACTIVE)
            .annotate(
                collected_amount_real=Coalesce(
                    Sum(
                        "donations__amount",
                        filter=Q(donations__status=Donation.STATUS_RECEIVED)
                    ),
                    Decimal("0.00")
                ),
                donations_count=Coalesce(
                    Count(
                        "donations",
                        filter=Q(donations__status=Donation.STATUS_RECEIVED)
                    ),
                    0
                ),
            )
            .order_by("-collected_amount_real", "-created_at")[:limit]
        )

        return Response(FeaturedFundraiserSerializer(qs, many=True).data)

class FundraiserCategoriesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # categories from DB (only active)
        qs = (
            Fundraiser.objects
            .filter(status=Fundraiser.STATUS_ACTIVE)
            .values("category")
            .annotate(count=Count("id"))
            .order_by("-count", "category")
        )

        categories = [{"id": "all", "label": "All Causes", "count": Fundraiser.objects.filter(status=Fundraiser.STATUS_ACTIVE).count()}]
        for row in qs:
            cat = (row["category"] or "").strip()
            if not cat:
                continue
            categories.append({
                "id": cat.lower().replace(" ", "_"),
                "label": cat,
                "count": row["count"],
            })

        return Response(categories)


class FundraiserDiscoverView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = (request.query_params.get("q") or "").strip()
        category = (request.query_params.get("category") or "").strip()
        offset = int(request.query_params.get("offset", 0))
        limit = int(request.query_params.get("limit", 6))
        sort = (request.query_params.get("sort") or "newest").strip().lower()

        qs = Fundraiser.objects.filter(status=Fundraiser.STATUS_ACTIVE)

        if category and category.lower() != "all":
            # category is passed as label from frontend
            qs = qs.filter(category__iexact=category)

        if q:
            qs = qs.filter(
                Q(title__icontains=q) |
                Q(location__icontains=q) |
                Q(owner__username__icontains=q)
            )

        sort_map = {
            "newest": "-created_at",
            "most_funded": "-collected_amount_real",
            "ending_soon": "deadline",
            "most_supporters": "-donations_count",
            "needs_attention": "donations_count",  # low supporters first
        }

        qs = qs.annotate(
            collected_amount_real=Coalesce(
                Sum("donations__amount", filter=Q(donations__status=Donation.STATUS_RECEIVED)),
                Decimal("0.00")
            ),
            donations_count=Coalesce(
                Count("donations", filter=Q(donations__status=Donation.STATUS_RECEIVED)),
                0
            )
        )

        qs = qs.order_by(sort_map.get(sort, "-created_at"))

        total = qs.count()
        page = qs[offset: offset + limit]

        return Response({
            "results": DiscoverFundraiserSerializer(page, many=True).data,
            "total": total,
            "offset": offset,
            "limit": limit,
        })

class FundraiserPublicDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, fundraiser_id):
        fundraiser = (
            Fundraiser.objects
            .filter(id=fundraiser_id, status=Fundraiser.STATUS_ACTIVE)
            .select_related("owner")
            .prefetch_related("documents")
            .annotate(
                collected_amount_real=Coalesce(
                    Sum("donations__amount", filter=Q(donations__status=Donation.STATUS_RECEIVED)),
                    Decimal("0.00")
                ),
                donations_count=Coalesce(
                    Count("donations", filter=Q(donations__status=Donation.STATUS_RECEIVED)),
                    0
                )
            )
            .first()
        )

        if not fundraiser:
            return Response({"detail": "Not found"}, status=404)

        # latest donors (sidebar list)
        donations_qs = (
            Donation.objects
            .filter(fundraiser=fundraiser, status=Donation.STATUS_RECEIVED)
            .select_related("donor")
            .order_by("-created_at")[:30]
        )

        data = PublicFundraiserDetailSerializer(fundraiser).data
        data["donors"] = PublicDonationListSerializer(donations_qs, many=True).data

        return Response(data)


class FundraiserDonateCreateView(APIView):
    permission_classes = [IsAuthenticated]  # ✅ require login for this step

    def post(self, request, fundraiser_id):
        fundraiser = get_object_or_404(
            Fundraiser,
            id=fundraiser_id,
            status=Fundraiser.STATUS_ACTIVE
        )

        amount = request.data.get("amount")
        tip_amount = request.data.get("tip_amount", 0)
        frequency_label = (request.data.get("frequency_label") or "").strip()

        payment_method = (request.data.get("payment_method") or "").strip().lower()
        is_anonymous = bool(request.data.get("is_anonymous", False))
        message = (request.data.get("message") or "").strip()

        # Validate amount
        try:
            amount_dec = Decimal(str(amount))
            tip_dec = Decimal(str(tip_amount or 0))
        except Exception:
            return Response({"detail": "Invalid amount or tip_amount."}, status=400)

        if amount_dec <= 0:
            return Response({"detail": "Amount must be greater than 0."}, status=400)
        if tip_dec < 0:
            return Response({"detail": "Tip must be 0 or greater."}, status=400)

        # Validate payment method (simple allow-list for now)
        allowed = {"visa", "mastercard", "sadapay", "easypaisa", "nayapay", "raast"}
        if payment_method not in allowed:
            return Response({"detail": "Invalid payment_method."}, status=400)

        donor_name = "" if is_anonymous else (request.user.username or "")

        payer_phone = (request.data.get("payer_phone") or "").strip()

        card_holder_name = (request.data.get("card_holder_name") or "").strip()
        card_number = (request.data.get("card_number") or "").strip()
        card_expiry = (request.data.get("card_expiry") or "").strip()
        card_cvc = (request.data.get("card_cvc") or "").strip()

        is_card = payment_method in ["visa", "mastercard"]

        if is_card:
            if not card_holder_name:
                return Response({"detail": "Card holder name is required."}, status=400)
            if not card_number or len(card_number) < 12:
                return Response({"detail": "Valid card number is required."}, status=400)
            if not card_expiry:
                return Response({"detail": "Expiry date is required."}, status=400)
            if not card_cvc or len(card_cvc) < 3:
                return Response({"detail": "CVC is required."}, status=400)

            card_last4 = card_number[-4:]
            payer_phone = ""  # not needed for card
        else:
            if not payer_phone:
                return Response({"detail": "Phone number is required for this payment method."}, status=400)
            # clear card fields
            card_holder_name = ""
            card_last4 = ""
            card_expiry = ""

        with transaction.atomic():
            donation = Donation.objects.create(
                recipient=fundraiser.owner,
                fundraiser=fundraiser,
                donor=request.user,
                donor_name=donor_name,
                amount=amount_dec,
                tip_amount=tip_dec,
                frequency_label=frequency_label,
                payment_method=payment_method,
                is_anonymous=is_anonymous,
                message=message,
                status=Donation.STATUS_RECEIVED,
                payer_phone=payer_phone,
                card_holder_name=card_holder_name,
                card_number_last4=card_last4,
                card_expiry=card_expiry,
            )

        return Response({
            "id": donation.id,
            "status": donation.status,
            "message": "Donation received",
        }, status=201)