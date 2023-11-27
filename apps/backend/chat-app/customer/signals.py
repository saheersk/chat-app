# from django.db.models.signals import post_save
# from django.dispatch import receiver

# import asyncio
# from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync

# from customer.models import Notification

# from channels.db import database_sync_to_async

# @receiver(post_save, sender=Notification)
# def handle_new_message(sender, instance, created, **kwargs):
#     if created:  # Only proceed if the instance is newly created
#         channel_layer = get_channel_layer()
#         loop = asyncio.new_event_loop()
#         asyncio.set_event_loop(loop)

#         user_id = instance.receiver_info.id

#         print("user is online")
#         loop.run_until_complete(channel_layer.group_send(
#                 f"notification_{user_id}",
#                 {
#                     "type": "notification.message",
#                     "notification_type": "new_message",
#                     "data": {
#                         "sender_id": instance.sender_info.id,
#                         "list_id": instance.thread.id,
#                         "sender_name": instance.sender_info.username,
#                         "message": instance.message,
#                     },
#                 },
#             ))
        
#         instance.is_received = True
#         instance.save()
