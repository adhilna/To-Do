import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'to_do.settings')

from django.core.asgi import get_asgi_application
django_asgi_app = get_asgi_application()
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from Home.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": JWTAuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})
