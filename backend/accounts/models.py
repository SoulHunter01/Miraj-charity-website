from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class User(AbstractUser):
    phone = models.CharField(max_length=20, blank=True, null=True)
    cnic = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)

class PayoutPreference(models.Model):
    METHOD_BANK = "bank"
    METHOD_NAYAPAY = "nayapay"
    METHOD_SADAPAY = "sadapay"
    METHOD_JAZZCASH = "jazzcash"
    METHOD_EASYPAISA = "easypaisa"
    METHOD_RAAST = "raast"

    METHOD_CHOICES = [
        (METHOD_BANK, "Bank Account"),
        (METHOD_NAYAPAY, "NayaPay"),
        (METHOD_SADAPAY, "SadaPay"),
        (METHOD_JAZZCASH, "JazzCash"),
        (METHOD_EASYPAISA, "EasyPaisa"),
        (METHOD_RAAST, "Raast"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payout_preference",
    )

    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default=METHOD_BANK)

    # Bank fields (only required when method=bank)
    account_title = models.CharField(max_length=120, blank=True, default="")
    account_number = models.CharField(max_length=50, blank=True, default="")
    iban = models.CharField(max_length=40, blank=True, default="")
    raast_id = models.CharField(max_length=80, blank=True, default="")

    # Wallet fields (required for non-bank)
    phone_number = models.CharField(max_length=30, blank=True, default="")

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user_id} - {self.method}"

class NotificationPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_preference",
    )

    # Emails
    email_fundraiser_updates = models.BooleanField(default=True)
    email_donation_received = models.BooleanField(default=True)
    email_messages_from_donor = models.BooleanField(default=True)
    email_connected_fundraisers = models.BooleanField(default=True)

    # SMS/msgs (or in-app later)
    msg_fundraiser_updates = models.BooleanField(default=False)
    msg_donation_received = models.BooleanField(default=False)
    msg_donation_confirmation = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notifications({self.user_id})"


class AccountSetting(models.Model):
    DEAL_WITH_FUNDS_RETURN_BANK = "return_bank"
    DEAL_WITH_FUNDS_DONATE_CONNECTED = "donate_connected"
    DEAL_WITH_FUNDS_DONATE_EXPENSES = "donate_expenses"
    DEAL_WITH_FUNDS_KEEP = "keep"

    DEAL_WITH_FUNDS_CHOICES = [
        (DEAL_WITH_FUNDS_RETURN_BANK, "Return to my bank account"),
        (DEAL_WITH_FUNDS_DONATE_CONNECTED, "Donate to connected fundraiser"),
        (DEAL_WITH_FUNDS_DONATE_EXPENSES, "Donate to website expenses"),
        (DEAL_WITH_FUNDS_KEEP, "Keep it as it is"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="account_setting",
    )

    funds_allocation_choice = models.CharField(
        max_length=30,
        choices=DEAL_WITH_FUNDS_CHOICES,
        blank=True,
        default="",
    )

    # Soft states (don’t delete rows)
    is_deactivated = models.BooleanField(default=False)
    is_closed = models.BooleanField(default=False)

    two_step_verification = models.BooleanField(default=False)
    cookies_enabled = models.BooleanField(default=True)

    # for “confirm contact number” UX (optional)
    otp_contact_number = models.CharField(max_length=30, blank=True, default="")

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AccountSetting({self.user_id})"

class Donation(models.Model):
    STATUS_RECEIVED = "received"
    STATUS_PENDING = "pending"

    STATUS_CHOICES = [
        (STATUS_RECEIVED, "Received"),
        (STATUS_PENDING, "Pending"),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="donations_received",
    )

    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="donations_made",
    )

    donor_name = models.CharField(max_length=120, blank=True, default="")
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    frequency_label = models.CharField(max_length=50, blank=True, default="")  # e.g. "weekly"
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_RECEIVED)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.recipient_id} - {self.amount} - {self.status}"

class Fundraiser(models.Model):
    STATUS_ACTIVE = "active"
    STATUS_CLOSED = "closed"
    STATUS_DRAFT = "draft"

    STATUS_CHOICES = [
        (STATUS_ACTIVE, "Active"),
        (STATUS_CLOSED, "Closed"),
        (STATUS_DRAFT, "Draft"),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="fundraisers",
    )

    title = models.CharField(max_length=200)
    image = models.ImageField(upload_to="fundraisers/", blank=True, null=True)

    target_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    collected_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    deadline = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_DRAFT)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title