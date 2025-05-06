from . import firebase_auth
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from firebase_admin import auth

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

# Create your views here.
def index(request):
    return HttpResponse("Hello, world. You're at the users index.")

@api_view(['GET'])
@permission_classes([AllowAny])
def publicUsers(request):
    # This view is public and does not require authentication
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({'users': serializer.data})
    
    

class RegisterUserView(APIView):
    def post(self, request):
        data = request.data
        try:
            # Create a new user in Firebase Authentication
            user_record = auth.create_user(
                email=data['email'],
                password=data['password'],
                display_name=f"{data['first_name']} {data['last_name']}",
            )

            # Create a new user in the local database
            user = User.objects.create(
                firebase_uid=user_record.uid,
                email=data['email'],
                phone=data.get('phone', ''),
                first_name=data['first_name'],
                last_name=data['last_name'],
                birthday=data['birthday'],
                user_type=data.get('user_type', 'user'),  # Default to 'user' if not provided
            )
            return Response({'message': 'User created', 'uid': user.firebase_uid}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


