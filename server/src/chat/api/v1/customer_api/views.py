from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import  permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView

from api.v1.customer_api.serializers import MemberSerializer, ChatMessageSerializer, UserSerializer, GroupChatSerializer, GroupChatListSerializer, GroupChatMessageSerializer
from customer.models import AddedList, ChatMessage, GroupChatMessage, GroupChat
from user_auth.models import User


@permission_classes([IsAuthenticated])
class MemberList(ListAPIView):
    
    def post(self, request):
        data = request.data
        serializer = MemberSerializer(data=data)

        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save()

        return Response({
                'status': True,
                'message': 'New member created successfully'
            }, status=status.HTTP_201_CREATED)
    
    def get(self, request):
        members = AddedList.objects.filter(
            Q(first_person=request.user) | Q(second_person=request.user)
        )  
        other_user_data = []

        for member in members:
            other_user_data.append({
                'id': member.id,  
                'members': UserSerializer(member.first_person).data if member.first_person != request.user else UserSerializer(member.second_person).data,
            })

        return Response({
            'members': other_user_data
        }, status=status.HTTP_200_OK)

    


@permission_classes([IsAuthenticated])
class ChatMessages(APIView):

    def get(self, request, id):
        added_list = get_object_or_404(AddedList, pk=id)
        chat_messages = ChatMessage.objects.filter(thread=added_list)

        serializer = ChatMessageSerializer(chat_messages, many=True)

        return Response({
            'chat_messages': serializer.data
        }, status=status.HTTP_200_OK)
    

@permission_classes([IsAuthenticated])
class GroupChatList(APIView):

    def post(self, request):
        data = request.data
        serializer = GroupChatSerializer(data = data)

        print(data, 'data')

        if not serializer.is_valid():
            return Response({
                'status': False,
                'message': serializer.errors
            },status = status.HTTP_400_BAD_REQUEST)
        
        serializer.save()
        
        return Response({
                'status': True,
                'message': 'New Group created successfully'
            },status = status.HTTP_201_CREATED)
    
    def get(self, request):
        group_chat = GroupChat.objects.filter(members=request.user)  

        serializer = GroupChatListSerializer(group_chat, many=True)

        return Response({
            'group_chat_messages': serializer.data
        }, status=status.HTTP_200_OK)
    

@permission_classes([IsAuthenticated])
class GroupChatMessages(APIView):

    def get(self, request, id):
        group_chat = get_object_or_404(GroupChat, pk=id)
        chat_messages = GroupChatMessage.objects.filter(group_chat=group_chat)

        serializer = GroupChatMessageSerializer(chat_messages, many=True)

        return Response({
            'chat_messages': serializer.data
        }, status=status.HTTP_200_OK)


@permission_classes([IsAuthenticated])
class UserList(ListAPIView):
    def get(self, request):
        users = User.objects.all().exclude(username=request.user.username)

        serializer = UserSerializer(users, many=True)
        
        return Response({
            'users': serializer.data
        }, status=status.HTTP_200_OK)