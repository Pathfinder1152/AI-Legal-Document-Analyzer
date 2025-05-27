from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# We're using the default Django User model, so we don't need to register anything new here.
# You can customize the UserAdmin if needed:

# class CustomUserAdmin(UserAdmin):
#     list_display = UserAdmin.list_display + ('custom_field',)
#     fieldsets = UserAdmin.fieldsets + (
#         ('Custom Fields', {'fields': ('custom_field',)}),
#     )
