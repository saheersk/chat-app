from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import  permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListAPIView, DestroyAPIView, UpdateAPIView

from api.v1.customer_api.serializers import MemberSerializer, ChatMessageSerializer, UserSerializer, GroupChatSerializer, GroupChatListSerializer, GroupChatMessageSerializer, UserProfileSerializer
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

        second_person = serializer.validated_data.get('second_person')
        first_person = serializer.validated_data.get('first_person')
        member = AddedList.objects.get(first_person=first_person, second_person=second_person)

        new_data = {
            'id': member.id,  
            'members': UserSerializer(member.second_person).data,
        }

        return Response({
            'status': True,
            'message': 'New member created successfully',
            'data': new_data
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



class MemberRemove(DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def destroy(self, request, *args, **kwargs):
        member_id = kwargs.get('id')
        instance = AddedList.objects.get(id=member_id)
        self.perform_destroy(instance)

        return Response({'status': True, 'message': 'Member deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


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
    

class ProfileView(ListAPIView, UpdateAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        users = User.objects.get(id=request.user.id)
        serializer = UserProfileSerializer(users)
        return Response({
            'users': serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        user = User.objects.get(id=request.user.id)
        serializer = UserProfileSerializer(user, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': True,
                'message': 'User profile updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'status': False,
                'message': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)