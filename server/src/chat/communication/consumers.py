import json

from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

from rest_framework_simplejwt.tokens import AccessToken

from user_auth.models import User
from customer.models import ChatMessage, AddedList



class ChatConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None

    async def connect(self):
        headers = dict(self.scope.get('headers', []))
        authorization_header = headers.get(b'authorization', b'').decode('utf-8')

        if not authorization_header.startswith('Bearer '):
            print("not auth")
            await self.close()
            return
        
        token = authorization_header[len('Bearer '):]

        if token:
            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                user = await self.get_user_by_id(user_id)

                if user is not None:
                    self.scope['user'] = user
                    # sender_id = self.scope["url_route"]["kwargs"]["sender_id"]
                    room_id = self.scope["url_route"]["kwargs"]["room_id"]
                    sender, recipient = await self.get_users(user.id, room_id)

                    if not sender or not recipient:
                        await self.close()
                        return

                    self.room_name = await self.create_or_get_room(sender, recipient)
                    self.room_group_name = f"chat_{self.room_name}"

                    print(f"Connected to room group: {self.room_group_name}")
                    await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                    await self.accept()

            except Exception as e:
                print("auth exception")
                await self.close()

    async def disconnect(self, close_code):
        if self.room_group_name:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
            await self.close(code=close_code)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        sender_id = text_data_json["sender_id"]
        list_id = text_data_json["list_id"]

        sender, receiver = await self.get_users(sender_id, list_id)

        if sender and receiver:
            await self.save_message(sender, list_id, message)

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name, {
                    "type": "chat.message",
                    "message": message,
                    "sender": sender.id,
                    "sender_name": sender.username,
                    "receiver": receiver.id,
                    "receiver_name": receiver.username,
                }
            )


    async def chat_message(self, event):
        message = event["message"]
        sender = event.get("sender", "")
        receiver = event.get("receiver", "")
        sender_name = event.get("sender_name", "")
        receiver_name = event.get("receiver_name", "")

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"sender": sender, "sender_name": sender_name, "message": message, "receiver": receiver, "receiver_name": receiver_name}))

    @database_sync_to_async
    def get_users(self, sender_id, room_id):
        try:
            print(room_id, "room_id")
            sender_info = User.objects.get(id=sender_id)
            user_list = AddedList.objects.get(id=room_id)

            receiver_id = None
            if AddedList.objects.filter(id=room_id, first_person=sender_info).exists():
                receiver_id = user_list.second_person.id 
            else:
                receiver_id = user_list.first_person.id 

            print(sender_id, "sender_id")
            print(receiver_id, "receiver_id")

            sender = sender_info
            receiver = User.objects.get(id=receiver_id)  

            return sender, receiver
        except User.DoesNotExist:
            print("user does not exist")
            return None, None

    
    @database_sync_to_async
    def save_message(self, sender, list_record, message):
        try:
            users_list = AddedList.objects.get(id=list_record)
            room = ChatMessage.objects.create(thread=users_list, user=sender, message=message)
            room.save()
        except Exception as e:
            print(f"Error saving message: {e}")

    @database_sync_to_async
    def create_or_get_room(self, sender, receiver):
        try:
            user_ids = sorted([sender.id, receiver.id])
            room_name = f"chat_{user_ids[0]}-{user_ids[1]}"
            return room_name  # Return the room_name as a valid string
        except Exception as e:
            print(f"Error creating or getting room: {e}")
            return None
    
    @database_sync_to_async
    def get_user_by_id(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return None




















