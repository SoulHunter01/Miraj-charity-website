from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import PayoutPreference
from .models import NotificationPreference, AccountSetting, Donation, Fundraiser
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
        fields = ["id", "donor_name", "amount", "frequency_label", "status", "created_at"]