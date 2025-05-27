from django.urls import path
from .views import (
    RegisterView, 
    LoginView, 
    LogoutView,
    UserDetailsView,
    CSRFTokenView,
    SessionView,
    ProfileUpdateView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', LoginView.as_view(), name='auth_login'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('user/', UserDetailsView.as_view(), name='auth_user_details'),
    path('profile/update/', ProfileUpdateView.as_view(), name='auth_profile_update'),
    path('csrf/', CSRFTokenView.as_view(), name='auth_csrf_token'),
    path('session/', SessionView.as_view(), name='auth_session'),
]
