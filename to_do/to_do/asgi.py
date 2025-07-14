import os
from django.core.asgi import get_asgi_application
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import Home.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'to_do.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            Home.routing.websocket_urlpatterns
        )
    ),
})
