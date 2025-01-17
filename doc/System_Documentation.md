# Dokumentacja Systemu i Schematu Bazy Danych

## Spis Treści
- [Architektura Systemu](#architektura-systemu)
  - [Komponenty Kontenerów Docker](#komponenty-kontenerów-docker)
  - [Konfiguracja Sieci](#konfiguracja-sieci)
- [Schema Bazy Danych](#schema-bazy-danych)
  - [Zarządzanie Użytkownikami](#zarządzanie-użytkownikami)
  - [Zarządzanie Projektami](#zarządzanie-projektami)
  - [Zarządzanie Obrazami](#zarządzanie-obrazami)
- [Diagramy](#diagramy)
  - [Architektura Systemu](#architektura-systemu-1)
  - [Schema Bazy Danych](#schema-bazy-danych-1)
- [Wnioski i Rekomendacje](#wnioski-i-rekomendacje)

## Architektura Systemu

### Komponenty Kontenerów Docker

#### Frontend Container
- **Port:** 3000:80
- Odpowiedzialny za interfejs użytkownika.
- Zbudowany w kontekście `./frontend`.
- Umożliwia interaktywną pracę (`stdin_open: true`, `tty: true`).

#### Backend Container
- **Port:** 8000:8000
- Obsługuje logikę biznesową i API.
- Konfiguracja przez zmienne środowiskowe:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `POSTGRES_HOST`
- Przechowuje media w persystentnym woluminie `backend_media`.

#### PostgreSQL Container
- **Port:** 5432:5432
- Baza danych PostgreSQL.
- Dane przechowywane w woluminie `postgres_data`.
- Konfigurowana przez te same zmienne środowiskowe co backend.

#### Adminer Container
- **Port:** 8080:8080
- Narzędzie do zarządzania bazą danych.
- Zależny od kontenera PostgreSQL.

### Konfiguracja Sieci
- Wszystkie kontenery (oprócz frontendu) połączone w sieci `tagtron_network`.
- Umożliwia bezpieczną komunikację między usługami.

## Schema Bazy Danych

### Zarządzanie Użytkownikami

**Tabela Users**
- `id`: Klucz główny.
- `email`: Unikalny adres email.
- `username`: Unikalna nazwa użytkownika.
- `first_name`: Imię.
- `last_name`: Nazwisko.
- `hashed_password`: Zaszyfrowane hasło.
- `is_active`: Status aktywności konta.
- `role_id`: Powiązanie z rolą systemową.

**Tabela Roles**
- `id`: Klucz główny.
- `name`: Unikalna nazwa roli systemowej.

### Zarządzanie Projektami

**Tabela Projects**
- `id`: Klucz główny.
- `title`: Tytuł projektu.
- `description`: Opis projektu.
- `owner_id`: ID właściciela (powiązanie z Users).

**Tabela ProjectUsers**
- `id`: Klucz główny.
- `project_id`: Powiązanie z projektem.
- `user_id`: Powiązanie z użytkownikiem.
- `role_id`: Powiązanie z rolą projektową.

**Tabela ProjectRoles**
- `id`: Klucz główny.
- `name`: Unikalna nazwa roli projektowej.

### Zarządzanie Obrazami

**Tabela Images**
- `id`: Klucz główny.
- `name`: Nazwa obrazu.
- `path`: Unikalna ścieżka do pliku.
- `upload_date`: Data przesłania.
- `size_x`: Szerokość obrazu.
- `size_y`: Wysokość obrazu.
- `project_id`: Powiązanie z projektem.
- `owner_id`: Powiązanie z właścicielem.

**Tabela Labels**
- `id`: Klucz główny.
- `image_id`: Powiązanie z obrazem.
- `label`: Etykieta/adnotacja.
- `create_time`: Czas utworzenia.
- `position_x1`: Pozycja X początku bounding box.
- `position_y1`: Pozycja Y początku bounding box.
- `position_x2`: Pozycja X końca bounding box.
- `position_y2`: Pozycja Y końca bounding box.
- `owner_id`: Powiązanie z twórcą etykiety.

## Diagramy

### Architektura Systemu
*(Dodaj diagram tutaj)*

### Schema Bazy Danych
*(Dodaj diagram tutaj)*

## Wnioski i Rekomendacje

### Mocne Strony Systemu
- Dobrze przemyślana architektura mikrousługowa.
- Zaawansowany system uprawnień na dwóch poziomach.
- Elastyczny system adnotacji obrazów.
- Skalowalność dzięki konteneryzacji.
- Bezpieczne przechowywanie danych w woluminach.

### Potencjalne Obszary do Rozwoju
- Możliwość dodania cache'owania dla często używanych obrazów.
- Implementacja systemu wersjonowania etykiet.
- Rozważenie dodania systemu powiadomień.
- Możliwość rozszerzenia o funkcje eksportu/importu projektów.
- Dodanie mechanizmów automatycznego backupu.

### Zalecenia Bezpieczeństwa
- Regularne aktualizacje kontenerów.
- Monitoring dostępu do bazy danych.
- Implementacja rate limitingu dla API.
- Regularne audyty uprawnień użytkowników.
- Szyfrowanie komunikacji między kontenerami.

### Perspektywy Rozwoju
- Możliwość integracji z systemami CI/CD.
- Dodanie wsparcia dla uczenia maszynowego.
- Rozszerzenie funkcjonalności o pracę zespołową.
- Implementacja API dla zewnętrznych integracji.
- Rozwój funkcji raportowania i analityki.
