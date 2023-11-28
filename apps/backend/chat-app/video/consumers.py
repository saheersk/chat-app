# your_app/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

from aiortc import RTCSessionDescription, RTCPeerConnection


class WebRTCConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.peer_connection = RTCPeerConnection()

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'video_{self.room_name}'

        # Add the user to the room's group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remove the user from the room's group when they disconnect
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data, "data")
        
        message_type = data['type']

        print(message_type, "type")


        if message_type == 'offer':
            await self.handle_offer(data['offer'])
        elif message_type == 'answer':
            await self.handle_answer(data['answer'])
        elif message_type == 'ice-candidate':
            await self.handle_ice_candidate(data['candidate'])
        else:
            # Handle other message types if needed
            pass

    async def handle_offer(self, offer):
        # Assuming self.peer_connection is your RTCPeerConnection instance
        offer = RTCSessionDescription(sdp=offer['sdp'], type='offer')
        await self.peer_connection.setRemoteDescription(offer)

        # Create an answer
        answer = await self.peer_connection.createAnswer()
        await self.peer_connection.setLocalDescription(answer)

        # Extract the relevant information for serialization
        answer_data = {
            'sdp': answer.sdp,
            'type': answer.type,
        }

        # Send the answer back to the other participant
        await self.send(text_data=json.dumps({
            'type': 'answer',
            'answer': answer_data,
        }))

    #     await self.channel_layer.group_send(
    #     self.room_group_name,
    #     {
    #         'type': 'send.answer',
    #         'answer': {
    #             'sdp': answer.sdp,
    #             'type': answer.type,
    #         },
    #         'participant_channel_name': self.channel_name,
    #     }
    # )

        # Notify the other participant about the offer
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send.offer',
                'offer': offer,
                'participant_channel_name': self.channel_name,
            }
        )

    async def send_offer(self, event):
        # Send the offer to the specified participant
        offer = event['offer']
        offer_data = {
            'sdp': offer.sdp,
            'type': offer.type,
        }

        # Send the offer to the specified participant
        await self.send(text_data=json.dumps({
            'type': 'offer',
            'offer': offer_data,
        }))

    async def handle_answer(self, answer):
        # Process the received answer
        # Update the existing connection state
        pass

    async def handle_ice_candidate(self, candidate):
        # Process the received ICE candidate
        # Add the ICE candidate to the existing connection
        pass
