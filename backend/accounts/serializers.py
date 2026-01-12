from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import PayoutPreference
from .models import NotificationPreference, AccountSetting, Donation, Fundraiser, FundraiserDocument, FundraiserPayout
from django.db.models import Count

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