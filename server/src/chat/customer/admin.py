from django.contrib import admin

from customer.models import AddedList, ChatMessage, GroupChatMessage, GroupChat


admin.site.register(AddedList)
admin.site.register(ChatMessage)

admin.site.register(GroupChat)
admin.site.register(GroupChatMessage)



