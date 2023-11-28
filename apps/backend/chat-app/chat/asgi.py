import os
import django

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat.settings')

django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
# from channels.security.websocket import AllowedHostsOriginValidator
from communication.routing import websocket_urlpatterns
from video.routing import websocket_urlpatterns as video_websocket_urlpatterns


application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        # URLRouter(websocket_urlpatterns)
        URLRouter(websocket_urlpatterns +  video_websocket_urlpatterns)
        )

})
