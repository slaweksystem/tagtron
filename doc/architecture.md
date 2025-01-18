# Architektura Backend

## Struktura Projektu

Projekt **Tagtron** składa się z następujących głównych komponentów:

- **Backend**: Serwer aplikacji zbudowany przy użyciu [FastAPI](https://fastapi.tiangolo.com/), odpowiedzialny za obsługę logiki biznesowej oraz komunikację z bazą danych.
- **Frontend**: Interfejs użytkownika stworzony w React, umożliwiający interakcję z aplikacją.
- **Baza Danych**: System zarządzania bazą danych PostgreSQL, przechowujący dane aplikacji.

W repozytorium struktura plików i katalogów prezentuje się następująco:

- `backend/`: Zawiera kod źródłowy serwera aplikacji.
  - `main.py`: Główny plik uruchamiający aplikację FastAPI.
  - `models/`: Definicje modeli danych używanych przez ORM.
  - `routers/`: Definicje tras (endpointów) API.
  - `schemas/`: Definicje schematów Pydantic do walidacji danych.
- `frontend/`: Zawiera kod źródłowy interfejsu użytkownika.
- `config/`: Pliki konfiguracyjne aplikacji.
- `media/`: Przechowuje przesłane pliki multimedialne.
- `doc/`: Dokumentacja projektu.
- `docker-compose.yml`: Plik konfiguracji Docker Compose do uruchamiania aplikacji w kontenerach.
- `README.md`: Plik zawierający ogólne informacje o projekcie.

## Główne Komponenty

### FastAPI

[FastAPI](https://fastapi.tiangolo.com/) to nowoczesny, szybki (wysokowydajny) framework do budowania interfejsów API w języku Python. Umożliwia tworzenie aplikacji z automatyczną walidacją danych oraz generowaniem dokumentacji interfejsu API.

### SQLAlchemy

Projekt wykorzystuje [SQLAlchemy](https://www.sqlalchemy.org/) jako ORM (Object-Relational Mapping) do interakcji z bazą danych PostgreSQL. SQLAlchemy umożliwia mapowanie klas Pythona na tabele w bazie danych, co ułatwia operacje CRUD (Create, Read, Update, Delete).

### Pydantic

[Pydantic](https://pydantic-docs.helpmanual.io/) jest używany do walidacji danych wejściowych i wyjściowych w FastAPI. Definiuje schematy danych, zapewniając ich integralność i poprawność.

## Przepływ Danych

1. **Żądanie Klienta**: Użytkownik wysyła żądanie HTTP do serwera FastAPI poprzez interfejs użytkownika lub bezpośrednio do endpointu API.
2. **Router**: FastAPI przekierowuje żądanie do odpowiedniego routera w zależności od ścieżki URL i metody HTTP.
3. **Walidacja Danych**: Dane wejściowe są walidowane za pomocą modeli Pydantic zdefiniowanych w `schemas/`.
4. **Logika Biznesowa**: Router wywołuje odpowiednią funkcję obsługującą żądanie, która zawiera logikę biznesową.
5. **Interakcja z Bazą Danych**: Jeśli operacja wymaga dostępu do danych, funkcja korzysta z modeli SQLAlchemy zdefiniowanych w `models/` do komunikacji z bazą danych PostgreSQL.
6. **Odpowiedź**: Po przetworzeniu żądania serwer zwraca odpowiedź HTTP do klienta, zawierającą dane w formacie JSON lub odpowiedni kod statusu.

Taka architektura zapewnia modularność, czytelność kodu oraz łatwość w utrzymaniu i rozbudowie aplikacji.
