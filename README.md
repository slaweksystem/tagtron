# Tagtron

![Logo](media/logo.jpg)

Tagtron to narzędzie do gromadzenia i oznaczania obrazów.

## Szczegóły

Aplikacja składa się z:

- **Backendu** napisanego w FastAPI
- **Frontendu** stworzonego w React
- **Bazy danych** PostgreSQL używanej do przechowywania danych

Strona służy do oznaczania obrazków (labelowania). Użytkownicy mogą tworzyć różne projekty, w ramach których można:

- Przechowywać obrazy
- Dodawać etykiety do obrazów
- Zarządzać projektami i danymi

## Documentacja

Dokumentacja Frontendu wykonanego przy użuciu biblioteki `React` znajduje sie w pliku [frontend.md]('doc/frontend.md')
Dokumentacja Backendu wykonanego w FastAPI znajduje się w pliku [backend.md](doc/backend.md)

## Uruchomienie aplikacji

Aby uruchomić aplikację przy użyciu Docker Compose, należy skonfigurować zmienne środowiskowe:

```bash
$POSTGRES_USER
$POSTGRES_PASSWORD
$POSTGRES_DB
$POSTGRES_HOSTs
```

Możesz także użyć pliku `.env` z komendą, na przykład:

```bash
docker compose --env-file config/.env.dev up -d
```

## Funkcjonalności

1. **Tworzenie projektów** - Zarządzanie projektami w ramach aplikacji.
2. **Przesyłanie obrazków** - Dodawanie obrazków do projektów.
3. **Labelowanie obrazków** - Oznaczanie obrazków przy pomocy etykiet.
4. **Zarządzanie danymi** - Przechowywanie szczegółów obrazów, etykiet i projektów w bazie danych.

## Instalacja i konfiguracja

### Wymagania

- Docker

### Kroki instalacji

1. Sklonuj repozytorium:

   ```bash
   git clone https://github.com/uzytkownik/tagtron.git
   cd tagtron
   ```

2. Skonfiguruj środowisko:
   - Utwórz plik `.env` na podstawie pliku `.env.dev` i ustaw odpowiednie zmienne środowiskowe.
3. Uruchom aplikację:

   ```bash
   docker compose up
   ```

## Użycie

1. Otwórz przeglądarkę i przejdź pod adres `http://localhost:3000`.
2. Zarejestruj się lub zaloguj, aby rozpocząć korzystanie z aplikacji.
3. Twórz projekty, przesyłaj obrazy i oznaczaj je za pomocą etykiet.

---
Dziękujemy za korzystanie z Tagtron!
