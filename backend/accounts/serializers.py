from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import PayoutPreference
from .models import NotificationPreference, AccountSetting, Donation, Fundraiser, FundraiserDocument, FundraiserPayout
from django.db.models import Count, Sum, Q
from datetime import date
from django.db.models.functions import Coalesce
from decimal import Decimal

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class PayoutPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayoutPreference
        fields = [
            "method",
            "account_title",
            "account_number",
            "iban",
            "raast_id",
            "phone_number",
        ]

    def validate(self, attrs):
        instance = getattr(self, "instance", None)

        method = attrs.get(
            "method",
            instance.method if instance else PayoutPreference.METHOD_BANK
        )

        # bank required fields
        if method == PayoutPreference.METHOD_BANK:
            account_title = attrs.get(
                "account_title",
                instance.account_title if instance else ""
            )
            account_number = attrs.get(
                "account_number",
                instance.account_number if instance else ""
            )

            if not account_title.strip():
                raise serializers.ValidationError(
                    {"account_title": "Account Title is required for Bank Account."}
                )
            if not account_number.strip():
                raise serializers.ValidationError(
                    {"account_number": "Account Number is required for Bank Account."}
                )

        # non-bank required field
        else:
            phone = attrs.get(
                "phone_number",
                instance.phone_number if instance else ""
            )
            if not phone.strip():
                raise serializers.ValidationError(
                    {"phone_number": "Phone Number is required for this payout method."}
                )

        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    payout_preference = PayoutPreferenceSerializer(required=False)

    class Meta:
        model = User
        fields = ["username", "email", "phone", "cnic", "avatar", "payout_preference"]
        read_only_fields = ["email", "username"]

    def update(self, instance, validated_data):
        payout_data = validated_data.pop("payout_preference", None)

        # update user fields (phone/cnic/avatar etc.)
        instance = super().update(instance, validated_data)

        # update/create payout preference
        if payout_data is not None:
            pref, _ = PayoutPreference.objects.get_or_create(user=instance)
            serializer = PayoutPreferenceSerializer(pref, data=payout_data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return instance

class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            "email_fundraiser_updates",
            "email_donation_received",
            "email_messages_from_donor",
            "email_connected_fundraisers",
            "msg_fundraiser_updates",
            "msg_donation_received",
            "msg_donation_confirmation",
        ]


class AccountSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountSetting
        fields = [
            "funds_allocation_choice",
            "is_deactivated",
            "is_closed",
            "two_step_verification",
            "cookies_enabled",
            "otp_contact_number",
        ]
        read_only_fields = ["is_deactivated", "is_closed"]

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField(min_length=6)
    confirm_password = serializers.CharField(min_length=6)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = ["id", "donor_name", "amount", "frequency_label", "status", "created_at"]

class FundraiserListSerializer(serializers.ModelSerializer):
    collected_amount = serializers.DecimalField(
        source="collected_amount_real",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    donations_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Fundraiser
        fields = [
            "id",
            "title",
            "image",
            "target_amount",
            "collected_amount",
            "deadline",
            "status",
            "donations_count",
        ]

class FundraiserDetailSerializer(serializers.ModelSerializer):
    collected_amount = serializers.DecimalField(
        source="collected_amount_real",
        max_digits=12,
        decimal_places=2,
        read_only=True
    )
    
    class Meta:
        model = Fundraiser
        fields = [
            "id",
            "title",
            "image",
            "status",
            "target_amount",
            "collected_amount",
            "deadline",
            "created_at",
        ]


class FundraiserDonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            "id",
            "donor_name",
            "amount",
            "frequency_label",
            "status",
            "created_at",
        ]

class FundraiserDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundraiserDocument
        fields = ["id", "file", "uploaded_at"]

class FundraiserPayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundraiserPayout
        fields = [
            "id",
            "method",
            "is_enabled",
            "bank_account_title",
            "bank_account_number",
            "bank_iban",
            "bank_raast_id",
            "phone_number",
        ]

    def validate(self, attrs):
        # validate only if enabled
        is_enabled = attrs.get("is_enabled", False)
        method = attrs.get("method")

        if not is_enabled:
            return attrs

        if method == FundraiserPayout.METHOD_BANK:
            if not (attrs.get("bank_account_title") or "").strip():
                raise serializers.ValidationError({"bank_account_title": "Account Title is required for Bank method."})
            if not (attrs.get("bank_account_number") or "").strip():
                raise serializers.ValidationError({"bank_account_number": "Account Number is required for Bank method."})
        else:
            if not (attrs.get("phone_number") or "").strip():
                raise serializers.ValidationError({"phone_number": "Phone number is required for this method."})

        return attrs


class FundraiserEditSerializer(serializers.ModelSerializer):
    documents = FundraiserDocumentSerializer(many=True, read_only=True)
    payouts = FundraiserPayoutSerializer(many=True, required=False)

    class Meta:
        model = Fundraiser
        fields = [
            "id",
            "title",
            "description",
            "location",
            "deadline",
            "target_amount",
            "image",
            "payouts",

            # payout
            "payout_method",
            "bank_account_title",
            "bank_account_number",
            "bank_iban",
            "bank_raast_id",
            "wallet_phone_number",

            "documents",
        ]

    def validate(self, attrs):
        inst = getattr(self, "instance", None)

        payout_related_keys = {
            "payout_method",
            "bank_account_title",
            "bank_account_number",
            "bank_iban",
            "bank_raast_id",
            "wallet_phone_number",
        }

        # ✅ only validate payout if request is changing payout fields
        if not any(k in attrs for k in payout_related_keys):
            return attrs

        method = attrs.get("payout_method", inst.payout_method if inst else "bank")

        if method == "bank":
            title = attrs.get("bank_account_title", inst.bank_account_title if inst else "")
            number = attrs.get("bank_account_number", inst.bank_account_number if inst else "")
            if not title.strip():
                raise serializers.ValidationError({"bank_account_title": "Account Title is required for Bank Account."})
            if not number.strip():
                raise serializers.ValidationError({"bank_account_number": "Account Number is required for Bank Account."})
        else:
            phone = attrs.get("wallet_phone_number", inst.wallet_phone_number if inst else "")
            if not phone.strip():
                raise serializers.ValidationError({"wallet_phone_number": "Phone Number is required for this payout method."})

        return attrs
    def update(self, instance, validated_data):
        payouts_data = validated_data.pop("payouts", None)

        instance = super().update(instance, validated_data)

        if payouts_data is not None:
            # Upsert each payout row by method
            for p in payouts_data:
                method = p.get("method")
                if not method:
                    continue

                obj, _ = FundraiserPayout.objects.get_or_create(
                    fundraiser=instance,
                    method=method
                )

                # update fields
                for k, v in p.items():
                    setattr(obj, k, v)
                obj.save()

        return instance

class FundraiserStartDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fundraiser
        fields = [
            "id",
            "fundraiser_purpose",

            "donee_name",
            "donee_gender",
            "donee_education_level",

            "institution_name",
            "institution_type",
            "institution_registration_number",
        ]

    def validate(self, attrs):
        purpose = (attrs.get("fundraiser_purpose") or self.instance.fundraiser_purpose or "").strip()

        if purpose == Fundraiser.PURPOSE_CHILD:
            if not (attrs.get("donee_name") or self.instance.donee_name).strip():
                raise serializers.ValidationError({"donee_name": "Name of donee is required."})
            if not (attrs.get("donee_education_level") or self.instance.donee_education_level).strip():
                raise serializers.ValidationError({"donee_education_level": "Education level is required."})

        elif purpose in [Fundraiser.PURPOSE_INSTITUTION, Fundraiser.PURPOSE_ORG]:
            if not (attrs.get("institution_name") or self.instance.institution_name).strip():
                raise serializers.ValidationError({"institution_name": "Institution/organization name is required."})
            if not (attrs.get("institution_type") or self.instance.institution_type).strip():
                raise serializers.ValidationError({"institution_type": "Institution type is required."})
            if not (attrs.get("institution_registration_number") or self.instance.institution_registration_number).strip():
                raise serializers.ValidationError({"institution_registration_number": "Registration number is required."})

        else:
            raise serializers.ValidationError({"fundraiser_purpose": "Please select a valid type of fundraiser."})

        return attrs

class StartFundraiserSerializer(serializers.Serializer):
    fundraiser_type = serializers.ChoiceField(choices=["individual", "organization"])

    def create(self, validated_data):
        request = self.context["request"]
        fundraiser_type = validated_data["fundraiser_type"]

        fundraiser = Fundraiser.objects.create(
            owner=request.user,
            status=Fundraiser.STATUS_DRAFT,
            title="Untitled Fundraiser",
        )

        # If you have fundraiser_type field in model, store it:
        if hasattr(fundraiser, "fundraiser_type"):
            fundraiser.fundraiser_type = fundraiser_type
            fundraiser.save(update_fields=["fundraiser_type"])

        return fundraiser

class FundraiserBasicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fundraiser
        fields = ["id", "title", "location", "category", "target_amount", "deadline"]

    def validate_title(self, v):
        v = (v or "").strip()
        if not v:
            raise serializers.ValidationError("Title is required.")
        return v

    def validate_location(self, v):
        v = (v or "").strip()
        if not v:
            raise serializers.ValidationError("Location is required.")
        return v

    def validate_category(self, v):
        v = (v or "").strip()
        if not v:
            raise serializers.ValidationError("Category is required.")
        return v

    def validate_target_amount(self, v):
        if v is None:
            raise serializers.ValidationError("Target amount is required.")
        if v <= 0:
            raise serializers.ValidationError("Target amount must be greater than 0.")
        return v

    def validate_deadline(self, v):
        if not v:
            raise serializers.ValidationError("Deadline is required.")
        return v

class FundraiserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fundraiser
        fields = ["id", "description"]

class FundraiserLinkOptionSerializer(serializers.ModelSerializer):
    donations_count = serializers.IntegerField(read_only=True)
    collected_amount_real = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Fundraiser
        fields = [
            "id",
            "title",
            "image",
            "target_amount",
            "collected_amount_real",
            "donations_count",
        ]

# ----------------------------
# Payout Setup (Multi-method)
# ----------------------------

class FundraiserPayoutMethodInputSerializer(serializers.Serializer):
    method = serializers.ChoiceField(choices=[
        FundraiserPayout.METHOD_BANK,
        FundraiserPayout.METHOD_NAYAPAY,
        FundraiserPayout.METHOD_SADAPAY,
        FundraiserPayout.METHOD_JAZZCASH,
        FundraiserPayout.METHOD_EASYPAISA,
        FundraiserPayout.METHOD_RAAST,
    ])
    is_enabled = serializers.BooleanField()

    # bank fields
    bank_account_title = serializers.CharField(required=False, allow_blank=True)
    bank_account_number = serializers.CharField(required=False, allow_blank=True)
    bank_iban = serializers.CharField(required=False, allow_blank=True)
    bank_raast_id = serializers.CharField(required=False, allow_blank=True)

    # phone for wallets
    phone_number = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        method = attrs.get("method")
        enabled = attrs.get("is_enabled", False)

        # if disabled, skip validation
        if not enabled:
            return attrs

        if method == FundraiserPayout.METHOD_BANK:
            if not (attrs.get("bank_account_title") or "").strip():
                raise serializers.ValidationError({"bank_account_title": "Account Title is required for Bank method."})
            if not (attrs.get("bank_account_number") or "").strip():
                raise serializers.ValidationError({"bank_account_number": "Account Number is required for Bank method."})
            # IBAN and RAAST optional
        else:
            if not (attrs.get("phone_number") or "").strip():
                raise serializers.ValidationError({"phone_number": "Phone number is required for this method."})

        return attrs


class FundraiserPayoutSetupSerializer(serializers.Serializer):
    """
    Accepts reimbursement_period + payout_methods[] for saving multiple payout methods at once.
    """
    reimbursement_period = serializers.ChoiceField(
        choices=[c[0] for c in getattr(Fundraiser, "REIMB_CHOICES", [])],
        required=False,
        allow_blank=True,
    )

    payout_methods = FundraiserPayoutMethodInputSerializer(many=True)

    def validate_payout_methods(self, methods):
        seen = set()
        for m in methods:
            if m["method"] in seen:
                raise serializers.ValidationError("Duplicate method in payout_methods.")
            seen.add(m["method"])
        return methods

class FeaturedFundraiserSerializer(serializers.ModelSerializer):
    organizer = serializers.CharField(source="owner.username", read_only=True)
    donations_count = serializers.IntegerField(read_only=True)
    collected_amount = serializers.DecimalField(
        source="collected_amount_real",
        max_digits=12,
        decimal_places=2,
        read_only=True,
    )
    days_left = serializers.SerializerMethodField()

    class Meta:
        model = Fundraiser
        fields = [
            "id",
            "title",
            "image",
            "category",
            "target_amount",
            "collected_amount",
            "donations_count",
            "organizer",
            "days_left",
        ]

    def get_days_left(self, obj):
        if not obj.deadline:
            return None
        delta = (obj.deadline - date.today()).days
        return max(delta, 0)

class DiscoverFundraiserSerializer(serializers.ModelSerializer):
    organizer = serializers.CharField(source="owner.username", read_only=True)
    supporters = serializers.IntegerField(source="donations_count", read_only=True)
    raised = serializers.DecimalField(source="collected_amount_real", max_digits=12, decimal_places=2, read_only=True)
    daysLeft = serializers.SerializerMethodField()

    class Meta:
        model = Fundraiser
        fields = [
            "id",
            "title",
            "description",
            "image",
            "category",
            "location",
            "organizer",
            "target_amount",
            "raised",
            "supporters",
            "daysLeft",
        ]

    def get_daysLeft(self, obj):
        if not obj.deadline:
            return None
        d = (obj.deadline - date.today()).days
        return max(d, 0)