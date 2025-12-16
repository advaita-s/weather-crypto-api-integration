import os
import requests

from django.contrib.auth.models import User

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Task
from .serializers import UserSerializer, TaskSerializer


# ---------------------------
# User registration + Task CRUD
# ---------------------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class TaskRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return Task.objects.filter(owner=self.request.user)


# ---------------------------
# External API proxies (Weather & Crypto)
# ---------------------------
class WeatherView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        city = request.query_params.get('city')
        units = request.query_params.get('units', 'metric')

        if not city:
            return Response({'error': 'city query param required'}, status=status.HTTP_400_BAD_REQUEST)

        api_key = os.getenv('OPENWEATHER_API_KEY')
        if not api_key:
            return Response(
                {'error': 'OpenWeather API key not configured in backend .env'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        try:
            params = {'q': city, 'appid': api_key, 'units': units}
            r = requests.get('https://api.openweathermap.org/data/2.5/weather', params=params, timeout=10)
            r.raise_for_status()
            data = r.json()

            simplified = {
                'city': data.get('name'),
                'weather': data.get('weather')[0].get('description') if data.get('weather') else None,
                'temperature': data.get('main', {}).get('temp'),
                'feels_like': data.get('main', {}).get('feels_like'),
                'humidity': data.get('main', {}).get('humidity'),
                'wind_speed': data.get('wind', {}).get('speed') if data.get('wind') else None,
                'raw': data
            }
            return Response(simplified, status=status.HTTP_200_OK)

        except requests.exceptions.HTTPError:
            code = getattr(r, 'status_code', status.HTTP_502_BAD_GATEWAY)
            return Response({'error': 'External API error', 'details': r.text}, status=code)
        except requests.exceptions.RequestException as e:
            return Response({'error': 'Failed to fetch weather', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({'error': 'Unexpected error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CryptoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        ids = request.query_params.get('ids', 'bitcoin')
        vs = request.query_params.get('vs_currency', 'usd')

        try:
            params = {'ids': ids, 'vs_currencies': vs, 'include_24hr_change': 'true'}
            r = requests.get('https://api.coingecko.com/api/v3/simple/price', params=params, timeout=10)
            r.raise_for_status()
            data = r.json()
            return Response({'query': {'ids': ids, 'vs_currency': vs}, 'prices': data}, status=status.HTTP_200_OK)
        except requests.exceptions.HTTPError:
            code = getattr(r, 'status_code', status.HTTP_502_BAD_GATEWAY)
            return Response({'error': 'External API error', 'details': r.text}, status=code)
        except requests.exceptions.RequestException as e:
            return Response({'error': 'Failed to fetch crypto', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({'error': 'Unexpected error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ---------------------------
# New: Crypto Markets (CoinGecko /coins/markets) with sparkline
# ---------------------------
class CryptoMarketsView(APIView):
    """
    GET /api/external/crypto_markets/?vs_currency=usd&per_page=20&page=1
    Proxies CoinGecko /coins/markets to provide market list with sparkline data.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        vs = request.query_params.get('vs_currency', 'usd')
        per_page = request.query_params.get('per_page', 20)
        page = request.query_params.get('page', 1)

        try:
            params = {
                'vs_currency': vs,
                'order': 'market_cap_desc',
                'per_page': per_page,
                'page': page,
                'sparkline': 'true',
                'price_change_percentage': '24h,7d'
            }
            r = requests.get('https://api.coingecko.com/api/v3/coins/markets', params=params, timeout=15)
            r.raise_for_status()
            data = r.json()
            # Return the raw data (CoinGecko already includes needed fields)
            return Response({'count': len(data), 'results': data}, status=status.HTTP_200_OK)
        except requests.exceptions.HTTPError:
            code = getattr(r, 'status_code', status.HTTP_502_BAD_GATEWAY)
            return Response({'error': 'External API error', 'details': r.text}, status=code)
        except requests.exceptions.RequestException as e:
            return Response({'error': 'Failed to fetch crypto markets', 'details': str(e)}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            return Response({'error': 'Unexpected error', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
