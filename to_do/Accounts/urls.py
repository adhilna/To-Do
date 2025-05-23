from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView  

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),  # Registration route
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login route for token (access + refresh)
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Token refresh route
]
