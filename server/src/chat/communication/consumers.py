import json
# from typing import Self
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from rest_framework_simplejwt.tokens import AccessToken

from user_auth.models import User

@sync_to_async
def get_user_by_id(id):
    return User.objects.get(id=id)

class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None

    async def connect(self):
         
        headers = dict(self.scope.get('headers', []))
        authorization_header = headers.get(b'authorization', b'').decode('utf-8')

        if not authorization_header.startswith('Bearer '):
            await self.close()
            return
        token = authorization_header[len('Bearer '):]

        if token:
            try:
                AccessToken(token)
            except Exception as e:
                await self.close()
                return
        
        self.user1 = await get_user_by_id(1)
        self.user2 = await get_user_by_id(2)

        self.room_name = self.get_room_name(self.user1, self.user2)
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        await self.close(code=close_code)

    async def receive(self, text_data):
        try:
            print(text_data, 'reciving txt')
            text_data_json = json.loads(text_data)
            message = text_data_json.get('message', '')

            # Check for an "action" in the received data
            action = text_data_json.get('action', '')

            if action == 'send_message':
                print('sending')
                await self.send_message(message)
            else:
                # Handle other actions or the absence of an action
                pass
        except json.decoder.JSONDecodeError as e:
            # Handle invalid JSON or empty data
            # You can log the error or take appropriate actions
            pass
        # Check if the user's channel name is in the list of room channels

    async def send_message(self, message):
        try:
            print(message, 'send message')
            # Send the message to the room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat.message',
                    'message': message,
                    'sender': self.user2.username,
                }
            )
        except json.decoder.JSONDecodeError as e:
            # Handle invalid JSON or empty data
            # You can log the error or take appropriate actions
            pass

    async def chat_message(self, event):
        print("chat-message")
        message = event['message']
        sender = event['sender']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({'message': message}))

    @staticmethod
    def get_room_name(user1, user2):
        # return f"{min(sender, receiver)}_{max(sender, receiver)}"
        return f"room_{user1.id}_{user2.id}"



# class ChatConsumerDefault(AsyncWebsocketConsumer):
#     async def connect(self):
#         # self.user1 = await get_user_by_id(1)
#         # self.user2 = await get_user_by_id(2)
#         # self.sender = self.scope['user'].username  # Get the sender's username
#         # self.receiver = self.scope['url_route']['kwargs']['receiver']  # Get the receiver from the URL
#         # self.room_name = self.get_room_name(self.user1, self.user2)
#         self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
#         self.room_group_name = f"chat_default_{self.room_name}"

#         # Join the room group
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)

#         await self.accept()

#     async def disconnect(self, close_code):
#         # Leave the room group
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         try:
#             print(text_data, 'reciving txt')
#             text_data_json = json.loads(text_data)
#             message = text_data_json.get('message', '')

#             # Check for an "action" in the received data
#             action = text_data_json.get('action', '')

#             if action == 'send_message':
#                 print('sending')
#                 await self.send_message(message)
#             else:
#                 # Handle other actions or the absence of an action
#                 pass
#         except json.decoder.JSONDecodeError as e:
#             # Handle invalid JSON or empty data
#             # You can log the error or take appropriate actions
#             pass

#     @staticmethod
#     def get_room_name(user1, user2):
#         # return f"{min(sender, receiver)}_{max(sender, receiver)}"
#         return f"room_{user1.id}_{user2.id}"