import uuid

from django.db import models

from user_auth.models import User


class AddedList(models.Model):
    first_person = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='first_person')
    second_person = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='second_person')
    first_person_public_key = models.TextField(blank=True, null=True)
    second_person_public_key = models.TextField(blank=True, null=True)
    updated = models.DateTimeField(auto_now=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['first_person', 'second_person']

    def __str__(self):
        return self.first_person.username
    
    def save(self, *args, **kwargs):
        if not self.first_person_public_key:
            self.first_person_public_key = self.first_person.public_key

        if not self.second_person_public_key:
            self.second_person_public_key = self.second_person.public_key

        super().save(*args, **kwargs)


class ChatMessage(models.Model):
    thread = models.ForeignKey(AddedList, null=True, blank=True, on_delete=models.CASCADE, related_name='chat_message')
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    attachment = models.FileField(upload_to='chat/attachments/', null=True, blank=True)
    is_read = models.BooleanField(default=False)
    is_delivered = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return self.user.username


class GroupChat(models.Model):
    name = models.CharField(max_length=255)
    members = models.ManyToManyField(User, related_name='group_chats', null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class GroupChatMessage(models.Model):
    group_chat = models.ForeignKey(GroupChat, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


