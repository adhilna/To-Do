from urllib.parse import parse_qs
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

@database_sync_to_async
def get_user(token):
    try:
        access_token = AccessToken(token)
        user = get_user_model().objects.get(id=access_token['user_id'])
        return user
    except Exception:
        return AnonymousUser()

class JWTAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        return JWTAuthMiddlewareInstance(scope, self)

class JWTAuthMiddlewareInstance:
    def __init__(self, scope, middleware):
        self.scope = dict(scope)
        self.middleware = middleware

    async def __call__(self, receive, send):
        query_string = self.scope["query_string"].decode()
        params = parse_qs(query_string)
        token = params.get("token")
        if token:
            self.scope["user"] = await get_user(token[0])
        else:
            self.scope["user"] = AnonymousUser()
        inner = self.middleware.inner(self.scope)
        return await inner(receive, send)
