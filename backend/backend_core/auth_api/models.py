from django.db import models
from django.contrib.auth.models import User

# We're using the built-in Django User model
# If you need to extend the User model, you can use a OneToOneField
# Example:
# 
# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
#     phone_number = models.CharField(max_length=15, blank=True, null=True)
#     organization = models.CharField(max_length=100, blank=True, null=True)
#     # Add more fields as needed
