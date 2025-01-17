# Wdrażanie Backend Tagtron

## Wprowadzenie

Instrukcja wdrażania backendu Tagtron opisuje kroki niezbędne do poprawnego uruchomienia aplikacji w środowisku deweloperskim, testowym oraz produkcyjnym.

---

## Wymagania Wstępne

Przed rozpocznięciem wdrażania upewnij się, że spełniasz poniższe wymagania:

- **System operacyjny:** Linux, macOS lub Windows (z WSL).
- **Python:** Wersja 3.9 lub nowsza.
- **Pośrednik bazy danych:** SQLite (dla dev) lub PostgreSQL (dla prod).
- **Narzędzia:**
  - `pip` (Python Package Installer)
  - `virtualenv` (zalecane)
  - `docker` i `docker-compose` (dla wdrożenia produkcyjnego)

---

## Instalacja i Konfiguracja

### 1. Klonowanie Repozytorium

Sklonuj repozytorium backendu:

```bash
git clone https://github.com/slaweksystem/tagtron.git
cd tagtron/backend
```

### 2. Tworzenie Wirtualnego Środowiska

Utwórz i aktywuj wirtualne środowisko Python:

```bash
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate   # Windows
```

### 3. Instalacja Zależności

Zainstaluj wszystkie wymagane pakiety:

```bash
pip install -r requirements.txt
```

### 4. Konfiguracja Zmiennych Środowiskowych

Stwórz plik `.env` na podstawie dostarczonego przykładu:

```bash
cp .env.example .env
```

Ustaw odpowiednie zmienne, np.:

```
DATABASE_URL=sqlite:///db.sqlite3
SECRET_KEY=twoj_sekret_klucz
DEBUG=True
```

### 5. Przygotowanie Bazy Danych

Wykonaj migracje bazy danych:

```bash
python manage.py migrate
```

### 6. Uruchamianie Serwera

Uruchom serwer deweloperski:

```bash
python manage.py runserver
```

Backend będzie dostępny pod adresem: [http://127.0.0.1:8000](http://127.0.0.1:8000).

---

## Wdrożenie Produkcyjne

### 1. Konfiguracja Dockera

Backend obsługuje wdrażanie za pomocą Dockera. Aby skonfigurować, upewnij się, że posiadasz:

- `docker`
- `docker-compose`

Uruchom kontenery:

```bash
docker-compose up -d
```

### 2. Migracje w Produkcji

W kontenerze backendu uruchom migracje bazy danych:

```bash
docker exec -it tagtron_backend python manage.py migrate
```

### 3. Debugowanie Problemów

Sprawdź logi kontenerów:

```bash
docker logs tagtron_backend
```

---

## Rozwiązywanie Problemów

1. **Błąd bazy danych:**
   - Sprawdź poprawność konfiguracji `DATABASE_URL` w pliku `.env`.
2. **Nieudane migracje:**
   - Usuń plik bazy danych `db.sqlite3` i ponownie uruchom migracje.

---

## Podsumowanie

Wdrożenie backendu Tagtron jest szybkie i intuicyjne. Dokumentacja obejmuje zarówno środowisko deweloperskie, jak i produkcyjne, co pozwala na sprawne zarządzanie aplikacją.
