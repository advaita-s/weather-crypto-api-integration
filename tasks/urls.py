from django.urls import path
from .views import (
    RegisterView, TaskListCreateView, TaskRetrieveUpdateDeleteView,
    WeatherView, CryptoView, CryptoMarketsView
)
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('tasks/', TaskListCreateView.as_view(), name='task_list_create'),
    path('tasks/<int:id>/', TaskRetrieveUpdateDeleteView.as_view(), name='task_detail'),

    # External APIs
    path('external/weather/', WeatherView.as_view(), name='external_weather'),
    path('external/crypto/', CryptoView.as_view(), name='external_crypto'),
    path('external/crypto_markets/', CryptoMarketsView.as_view(), name='external_crypto_markets'),
]
