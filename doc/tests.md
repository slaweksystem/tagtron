# Testowanie Backend Tagtron

## Wprowadzenie

Testowanie jest kluczowym elementem zapewnienia jakości i stabilności aplikacji. Dokumentacja opisuje sposób uruchamiania testów, wykorzystywane narzędzia oraz organizację katalogu testów.

---

## Narzędzia Testowe

Backend Tagtron wykorzystuje bibliotekę **pytest** do testów jednostkowych i integracyjnych. Dodatkowe narzędzia to:

- **pytest-django** - integracja pytest z Django.
- **factory_boy** - generowanie danych testowych.
- **coverage** - analiza pokrycia kodu testami.

### Instalacja Zależności

Przed uruchomieniem testów zainstaluj wszystkie wymagane pakiety:

```bash
pip install -r requirements-dev.txt
```

---

## Struktura Katalogu Testów

Testy znajdują się w katalogu `tests/`, a ich struktura odpowiada modułom aplikacji:

```plaintext
backend/
|│
|└── tests/
    |│
    |├── test_models.py        # Testy modeli Django
    |├── test_views.py         # Testy widoków i endpointów
    |├── test_serializers.py   # Testy serializerów
    |├── test_urls.py         # Testy routingu
    |└── factories.py         # Fabryki danych testowych
```

---

## Uruchamianie Testów

### Wszystkie Testy

Aby uruchomić wszystkie testy:

```bash
pytest
```

### Testy z Pokryciem

Aby uruchomić testy i sprawdzić pokrycie kodu:

```bash
pytest --cov=backend
```

### Testy dla Pojedynczego Pliku

Aby uruchomić testy tylko dla jednego pliku:

```bash
pytest tests/test_models.py
```

### Testy dla Pojedynczej Funkcji

Aby uruchomić konkretną funkcję testową:

```bash
pytest tests/test_models.py::test_function_name
```

---

## Pisanie Testów

### Przykładowy Test Modelu

```python
import pytest
from backend.models import Project

@pytest.mark.django_db
def test_project_creation():
    project = Project.objects.create(name="Test Project", description="Opis testowego projektu")
    assert project.name == "Test Project"
```

### Przykładowy Test Endpointu

```python
import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_get_projects():
    client = APIClient()
    response = client.get("/api/projects/")
    assert response.status_code == 200
```

---

## Analiza Pokrycia Kodem

Raport pokrycia kodu można wygenerować za pomocą `coverage`:

```bash
coverage run -m pytest
coverage html
```

Wygenerowany raport znajdziesz w katalogu `htmlcov/`.

---

## Debugowanie Testów

1. **Błąd konfiguracji Django:**
   - Sprawdź poprawność ustawienia `DJANGO_SETTINGS_MODULE`.
2. **Błędne dane testowe:**
   - Użyj fabryk danych w pliku `factories.py`.

---

## Podsumowanie

Testy w backendzie Tagtron zapewniają stabilność aplikacji oraz poprawność implementacji funkcjonalności. Zaleca się regularne uruchamianie testów i monitorowanie pokrycia kodu.
