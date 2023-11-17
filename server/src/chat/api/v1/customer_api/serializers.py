from django.db.models import Q

from rest_framework import serializers

from customer.models import AddedList, ChatMessage, GroupChat, GroupChatMessage
from user_auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddedList
        fields = ['id', 'first_person', 'second_person']

    def validate(self, data):
        first_user = data.get('first_person')
        second_user = data.get('second_person')

        if AddedList.objects.filter(
                (Q(first_person=first_user) & Q(second_person=second_user)) |
                (Q(first_person=second_user) & Q(second_person=first_user))
        ).exists():
            raise serializers.ValidationError("Your are friends")
        return data



class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['thread', 'user', 'message', 'is_read', 'is_delivered']


class GroupChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupChat
        fields = ['name', 'members']

    def create(self, validated_data):
        print("Creating group with data:", validated_data)

        members_data = validated_data.pop('members', [])
        print("Members data:", members_data)

        group_chat = GroupChat.objects.create(**validated_data)
        group_chat.members.set(members_data)

        print("Group created:", group_chat)
        return group_chat
    
    def validate(self, data):
        name = data.get('name')
        members = data.get('members')

        if not name:
            raise serializers.ValidationError("Name is required for group creation.")

        if not members or not isinstance(members, list):
            raise serializers.ValidationError("Members list is required for group creation.")

        return data


class GroupChatListSerializer(serializers.ModelSerializer):
    members = UserSerializer(many=True)
    class Meta:
        model = GroupChat
        fields = ['name', 'members']


class GroupChatMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = GroupChatMessage
        fields = ['user', 'message']