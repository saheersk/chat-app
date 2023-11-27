from django.contrib import admin

from customer.models import AddedList, ChatMessage, GroupChatMessage, GroupChat, Notification


class AddedListAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_person', 'second_person']

admin.site.register(AddedList, AddedListAdmin)


class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['id', 'thread', 'user', 'message']

admin.site.register(ChatMessage, ChatMessageAdmin)


class NotificationAdmin(admin.ModelAdmin):
    list_display = ['id', 'thread', 'sender_info', 'receiver_info', 'is_received']

admin.site.register(Notification, NotificationAdmin)


admin.site.register(GroupChat)
admin.site.register(GroupChatMessage)



