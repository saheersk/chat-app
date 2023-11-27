from django.contrib.auth import authenticate, login

from rest_framework.decorators import  permission_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import AllowAny

from .serilaizers import RegisterSerializer, LoginSerializer


@permission_classes([AllowAny])
class Login(APIView):

    def post(self, request):
        data = request.data
        serializer = LoginSerializer(data=data)

        if not serializer.is_valid():
            return Response({
                'status': False,
                'message':"Invalid credentials"
            },status = status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=serializer.data['username'], password=serializer.data['password'])

        if not user:
            return Response({
                'status': False,
                'message': serializer.errors
            },status = status.HTTP_400_BAD_REQUEST)
            
        login(request, user)
        refresh = RefreshToken.for_user(user)

        return Response({
                'status': True,
                'message': 'user logged in successfully',
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                },
                'username': request.user.username,
                "user_id": request.user.id,
                "private_key": request.user.private_key
            }, status = status.HTTP_200_OK)




@permission_classes([AllowAny])
class Register(APIView):

    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data = data)

        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': serializer.errors
            },status = status.HTTP_400_BAD_REQUEST)
        
        serializer.save()

        return Response({
                'status': True,
                'message': 'user created successfully'
            },status = status.HTTP_201_CREATED)
    
