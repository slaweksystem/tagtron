# Konfiguracja Backend Tagtron

## Wprowadzenie

Dokumentacja konfiguracji opisuje pliki i zmienne, które są kluczowe dla działania backendu Tagtron w różnych środowiskach (deweloperskim, testowym i produkcyjnym).

---

## Pliki Konfiguracyjne

### 1. `.env`

Plik `.env` zawiera kluczowe zmienne środowiskowe. Zaleca się używanie oddzielnych plików `.env` dla każdego środowiska:

- **.env.dev** - dla środowiska deweloperskiego.
- **.env.test** - dla testów.
- **.env.prod** - dla produkcji.

Przykładowa zawartość pliku `.env`:

```plaintext
# Baza danych
DATABASE_URL=sqlite:///db.sqlite3

# Sekrety aplikacji
SECRET_KEY=twoj_sekret_klucz

# Debugowanie
DEBUG=True

# Hosty dozwolone
ALLOWED_HOSTS=127.0.0.1,localhost
```

### 2. `settings.py`

Plik `settings.py` Django wykorzystuje zmienne środowiskowe do konfiguracji aplikacji. Kluczowe sekcje:

- **Baza danych:**

```python
DATABASES = {
    'default': dj_database_url.parse(os.getenv('DATABASE_URL'))
}
```

- **Debugowanie:**

```python
DEBUG = os.getenv('DEBUG', 'False') == 'True'
```

- **Dozwolone hosty:**

```python
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',')
```

---

## Zmienne Środowiskowe

### Kluczowe zmienne

| Zmienna           | Opis                                | Przykładowa wartość         |
|-------------------|-------------------------------------|--------------------------|
| `DATABASE_URL`    | URL połączenia z bazą danych     | `sqlite:///db.sqlite3`  |
| `SECRET_KEY`      | Klucz aplikacji Django             | `super_secret_key`      |
| `DEBUG`           | Włączenie trybu debugowania       | `True` lub `False`      |
| `ALLOWED_HOSTS`   | Lista dozwolonych hostów           | `127.0.0.1,localhost`   |
| `EMAIL_BACKEND`   | Backend wysyłania e-maili         | `django.core.mail.backends.smtp.EmailBackend` |

### Zmienne opcjonalne

| Zmienna             | Opis                                   | Przykładowa wartość             |
|---------------------|----------------------------------------|--------------------------|
| `EMAIL_HOST`        | Adres serwera SMTP                    | `smtp.gmail.com`        |
| `EMAIL_PORT`        | Port serwera SMTP                     | `587`                   |
| `EMAIL_USE_TLS`     | Czy użyć TLS do połączeń SMTP       | `True`                  |
| `EMAIL_HOST_USER`   | Nazwa użytkownika serwera SMTP         | `user@example.com`      |
| `EMAIL_HOST_PASSWORD` | Hasło do serwera SMTP               | `password`              |

---

## Zarządzanie Konfiguracją w Różnych Środowiskach

### 1. Środowisko Deweloperskie

- Użyj SQLite jako bazy danych.
- Włącz tryb debugowania (`DEBUG=True`).
- Skonfiguruj minimalne wymagane zmienne w `.env.dev`.

### 2. Środowisko Testowe

- Użyj oddzielnej bazy danych testowej (np. SQLite w pamięci).
- Wyłącz wysyłanie rzeczywistych e-maili, użyj backendu testowego:

```plaintext
EMAIL_BACKEND=django.core.mail.backends.locmem.EmailBackend
```

### 3. Środowisko Produkcyjne

- Użyj PostgreSQL lub innej produkcyjnej bazy danych.
- Wyłącz tryb debugowania (`DEBUG=False`).
- Zdefiniuj pełne ustawienia SMTP w `.env.prod`.
- Ustaw poprawne `ALLOWED_HOSTS` dla domeny produkcyjnej.

---

## Debugowanie Problematycznej Konfiguracji

1. **Niepoprawny format `DATABASE_URL`:**
   - Upewnij się, że URL jest zgodny z dokumentacją `dj-database-url`.

2. **Brak zmiennej środowiskowej:**
   - Sprawdź plik `.env` i upewnij się, że wszystkie wymagane zmienne są zdefiniowane.

3. **Błądy w produkcji:**
   - Sprawdź logi serwera oraz poprawność zmiennych w `.env.prod`.

---

## Podsumowanie

Dokumentacja konfiguracji backendu Tagtron ułatwia zarządzanie aplikacją w różnych środowiskach, zapewniając stabilność i bezpieczeństwo.
