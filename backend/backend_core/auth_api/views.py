from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import (
    UserSerializer, 
    UserLoginSerializer, 
    UserDetailsSerializer, 
    UserProfileUpdateSerializer
)

class RegisterView(APIView):
    """
    API endpoint for user registration
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response({
                    "message": "User registered successfully",
                    "user": UserDetailsSerializer(user).data
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """
    API endpoint for user login
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            
            if user:
                login(request, user)
                return Response({
                    "message": "Login successful",
                    "user": UserDetailsSerializer(user).data,
                    "csrftoken": get_token(request)
                }, status=status.HTTP_200_OK)
            return Response({
                "message": "Invalid username or password"
            }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """
    API endpoint for user logout
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        logout(request)
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        return response

class UserDetailsView(APIView):
    """
    API endpoint to get current user details
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserDetailsSerializer(request.user)
        return Response(serializer.data)

class CSRFTokenView(APIView):
    """
    API endpoint to get a CSRF token
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({"csrftoken": get_token(request)})

class SessionView(APIView):
    """
    API endpoint to check if user is authenticated
    """
    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                "isAuthenticated": True,
                "user": UserDetailsSerializer(request.user).data
            })
        return Response({"isAuthenticated": False})

class ProfileUpdateView(APIView):
    """
    API endpoint for updating user profile information
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def put(self, request):
        serializer = UserProfileUpdateSerializer(
            request.user, 
            data=request.data, 
            context={'request': request},
            partial=True
        )
        
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserDetailsSerializer(user).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)