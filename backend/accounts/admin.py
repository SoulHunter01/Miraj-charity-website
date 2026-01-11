from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model

User = get_user_model()

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # Show these fields in the list view
    list_display = ("username", "email", "phone", "cnic", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active")
    search_fields = ("username", "email", "phone", "cnic")
    ordering = ("-date_joined",)

    # Add phone/cnic/avatar fields to the user detail page in admin
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Profile Info", {"fields": ("phone", "cnic", "avatar")}),
    )
