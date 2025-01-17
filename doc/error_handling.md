# Obsługa Błędów w Backend Tagtron

## Wprowadzenie

Obsługa błędów jest kluczowym elementem zapewnienia niezawodności i przyjazności aplikacji dla użytkowników. Dokumentacja opisuje strategie zarządzania wyjątkami, struktury błędów oraz mechanizmy logowania w backendzie Tagtron.

---

## Typy Błędów

W backendzie Tagtron błędy dzielimy na trzy główne kategorie:

1. **Błędy Klienta (4xx):**
   - Wynikają z nieprawidłowych danych wejściowych lub żądań użytkownika.
   - Przykłady: `400 Bad Request`, `404 Not Found`.

2. **Błędy Serwera (5xx):**
   - Wskazują na problemy wewnętrzne aplikacji.
   - Przykłady: `500 Internal Server Error`, `503 Service Unavailable`.

3. **Błędy Specyficzne dla Aplikacji:**
   - Niestandardowe wyjątki związane z logiką biznesową.
   - Przykład: `ValidationError` w przypadku niepoprawnych danych.

---

## Mechanizmy Obsługi Błędów

### 1. Globalny Middleware Obsługi Błędów

Django wykorzystuje middleware do przechwytywania błędów. W pliku `settings.py` zarejestrowano następujący middleware:

```python
MIDDLEWARE = [
    ...
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### 2. Niestandardowy Handler Błędów

W projekcie zaimplementowano niestandardowe widoki obsługujące błędy HTTP:

- **`handler404`** - Obsługa błędu 404 (Nie znaleziono).
- **`handler500`** - Obsługa błędu 500 (Błąd serwera).

Przykład implementacji w `urls.py`:

```python
from django.http import JsonResponse

def custom_handler404(request, exception):
    return JsonResponse({"error": "Nie znaleziono zasobu"}, status=404)

def custom_handler500(request):
    return JsonResponse({"error": "Błąd wewnętrzny serwera"}, status=500)

handler404 = custom_handler404
handler500 = custom_handler500
```

### 3. Obsługa Wyjątków w Widokach

Każdy widok wykorzystuje blok `try-except` do obsługi wyjątków. Przykład:

```python
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError

class ExampleView(APIView):
    def get(self, request):
        try:
            # Logika widoku
            data = {"message": "Działa poprawnie"}
            return Response(data, status=200)
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response({"error": "Błąd wewnętrzny"}, status=500)
```

---

## Logowanie Błędów

### 1. Konfiguracja Logowania

Logowanie błędów skonfigurowano w pliku `settings.py`:

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'errors.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### 2. Przykładowe Logowanie

Każdy wyjątek można zalogować za pomocą modułu `logging`:

```python
import logging

logger = logging.getLogger('django')

try:
    # Kod, który może spowodować wyjątek
    1 / 0
except ZeroDivisionError as e:
    logger.error(f"Wystąpił błąd: {e}")
```

---

## Błędy Specyficzne dla Aplikacji

### ValidationError

W przypadku błędów walidacji wykorzystywany jest wyjątek `ValidationError`:

```python
from django.core.exceptions import ValidationError

def validate_positive_number(value):
    if value <= 0:
        raise ValidationError("Wartość musi być większa od zera.")
```

### CustomException

Możesz definiować własne wyjątki:

```python
class CustomException(Exception):
    def __init__(self, message):
        super().__init__(message)
```

---

## Debugowanie w Trybie Deweloperskim

W środowisku deweloperskim ustaw `DEBUG=True` w pliku `.env`. Umożliwi to wyświetlanie szczegółowych informacji o błędach.

---

## Podsumowanie

Dzięki odpowiednio zaimplementowanej obsłudze błędów backend Tagtron jest bardziej stabilny i łatwiejszy w utrzymaniu. Dobre praktyki, takie jak logowanie błędów i niestandardowe wyjątki, pomagają w szybkim diagnozowaniu problemów.
