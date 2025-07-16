# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print(f"🔌 WebSocket CONNECT from user: {self.scope['user']}")
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.group_name = f"user_{self.user.id}"
            print(f"📡 Adding {self.channel_name} to group {self.group_name}")
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
            await self.send(text_data=json.dumps({"message": "Welcome! ✅"}))
            print(f"✅ WebSocket CONNECTED for user {self.user.id}")
        else:
            print("❌ WebSocket REJECTED (unauthenticated user)")
            await self.close()

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))
        