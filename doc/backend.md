# Dokumentacja Backen Tagtron

Ta dokumentacja zawiera wszelkie informacje na temat wykorzystania FastAPI w backendzie.

## Spis Treści

1. [Instalacja i Uruchomienie](#instalacja-i-uruchomienie)
2. [Struktura Projektu](#struktura-projektu)
3. [Modele Danych](#modele-danych)
4. [Testowanie](#testowanie)
5. [Konfiguracja Środowiska](#konfiguracja-środowiska)
6. [Przykłady Użycia API](#przykłady-użycia-api)
7. [Obsługa Błędów](#obsługa-błędów)
8. [Bezpieczeństwo](#bezpieczeństwo)

## Instalacja i Uruchomienie

1. **Klonowanie Repozytorium**

   ```bash
   git clone https://github.com/slaweksystem/tagtron.git
   cd tagtron
   ```

2. **Instalacja Zależności**

    Użyj pip do zainstalowania wymaganych pakietów:

    ```bash
    pip install -r backend/requirements.txt
    ```

3. **Uruchomienie Serwera**

    Aby uruchomić serwer lokalnie, można skorzystać z narzędzia uvicorn:

    ```bash
    cd backend
    uvicorn app.main:app --port 8000
    ```

    Serwer będzie dostępny pod adresem <http://localhost:8000>.  
    Swagger będzie dosępny pod addrese, <http://localhost:8000/docs>

## Struktura Projektu

Projekt jest zorganizowany w następujący sposób:

```text
tagtron/
├── app/
|   ├── routers/
│   ├── main.py
│   ├── models.py
│   └── database.py
├── requirements.txt
└── README.md
```

- `main.py` - Główny plik aplikacji FastAPI.
- `models.py` - Definicje modeli danych z użyciem SQLAlchemy.
- `database.py` - Konfiguracja połączenia z bazą danych.
- `routers` - Definicje tras (endpointów) API.
- `requirements.txt` - Lista wymaganych pakietów.

## Modele Danych

Projekt wykorzystuje SQLAlchemy jako ORM do interakcji z bazą danych.

Przykład modelu użytkownika:

```python
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    projects = relationship('Project', back_populates='owner')
```

## Testowanie

Do testowania aplikacji używamy frameworka pytest w połączeniu z FastAPI, co pozwala na łatwe testowanie end-pointów oraz operacji na bazie danych. W szczególności, framework pytest wspiera testowanie jednostkowe, funkcjonalne oraz integracyjne, zapewniając łatwość w uruchamianiu testów oraz zarządzaniu danymi testowymi.

### Uruchamianie Testów

Aby uruchomić testy:

```bash
pytest
```

Spowoduje to wykonanie wszystkich testów znajdujących się w katalogach z plikami zaczynającymi się od `test_`. Warto zauważyć, że pytest automatycznie rozpozna testy po ich nazwach i odpowiednio je wykona, generując raport na konsoli.

Przykładowy output:

```bash
(.pyenv) PS C:\Projekty\github\tagtron\backend> pytest
=============================== test session starts ===============================
platform win32 -- Python 3.12.9, pytest-8.3.3, pluggy-1.5.0
rootdir: C:\Projekty\github\tagtron\backend
plugins: anyio-4.8.0
collected 13 items

app\test\test_auth.py ..ss                                                   [ 30%]
app\test\test_projects.py ....F                                              [ 69%]
app\test\test_users.py ....                                                  [100%]
[...]
-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
============================= short test summary info =============================
FAILED app/test/test_projects.py::test_add_users_to_project_email - KeyError: 'id'
=============== 1 failed, 10 passed, 2 skipped, 7 warnings in 5.32s ===============
```

### Przykład Testów w FastAPI przy użyciu pytest

W poniższym przykładzie testujemy API oparte na frameworku FastAPI. Testy obejmują operacje takie jak dodawanie użytkowników, zmiana haseł czy pobieranie danych użytkownika z bazy danych. Do testowania wykorzystujemy TestClient z FastAPI, który umożliwia symulowanie zapytań HTTP bez uruchamiania rzeczywistego serwera.

### Konfiguracja bazy danych testowej

Zastosowano bazę danych SQLite w trybie testowym (`testdb.db`), która jest używana tylko do celów testowych. Używamy `StaticPool` do zarządzania połączeniami z bazą, a także sessionmaker z SQLAlchemy do tworzenia sesji.

```python
SQLALCHEMY_DATABASE_URL = "sqlite:///./testdb.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)
```

### Fixtures

Fixtures w pytest umożliwiają przygotowanie danych do testów. W naszym przypadku, tworzymy fikcyjne dane użytkowników oraz projekty w bazie danych przed uruchomieniem testów. Dzięki użyciu `yield` możemy kontrolować moment, w którym dane są usuwane po zakończeniu testów.

```python
@pytest.fixture
def test_projects():
    db = TestingSessionLocal()
    for project in data_projects:
        db.add(project)
    db.commit()

    yield project[0]
```

### Testy API

Kilka przykładowych testów:

1. Test pobierania użytkownika
    Test sprawdza, czy endpoint /user zwraca dane użytkownika z poprawnymi wartościami. Sprawdzamy status odpowiedzi oraz czy zwrócone dane są zgodne z oczekiwanymi.

    ```python
    def test_return_user(test_users):
        response = client.get("/user")
        assert response.status_code == status.HTTP_200_OK
        assert response.json()['username'] == 'johnny'
        assert response.json()['email'] == 'johnnybravo@example.com'
    ```

2. Test dodawania nowego użytkownika
    Test wysyła żądanie POST do /auth/, aby dodać nowego użytkownika. Następnie sprawdzamy, czy odpowiedź ma status 201 Created, co oznacza, że użytkownik został poprawnie dodany. Po wykonaniu testu, użytkownik jest usuwany za pomocą zapytania DELETE.

    ```python
    def test_add_user(test_users):
        payload = {
                    "username": "johnnytestpass",
                    "email": "johnnybravotestpass@example.com",
                    "first_name": "Johnny",
                    "last_name": "Bravo",
                    "password": "1ubiepl@cki",
                  }
        response = client.post("/auth/", json=payload)
        assert response.status_code == status.HTTP_201_CREATED
        response = client.delete(f"/user/{payload['username']}")
        assert response.status_code == status.HTTP_204_NO_CONTENT
    ```

### Podsumowanie

Testowanie aplikacji z użyciem pytest w połączeniu z FastAPI umożliwia szybkie i efektywne sprawdzanie poprawności działania API. Wykorzystanie fixtures pozwala na przygotowanie danych testowych, a TestClient z FastAPI umożliwia symulowanie zapytań HTTP, co sprawia, że testy są niezależne od rzeczywistego serwera.

## Konfiguracja Środowiska

Aplikacja wymaga następujących zmiennych środowiskowych:

POSTGRES_USER - Użytkownik bazy danych
POSTGRES_PASSWORD - hasło użytkownika bazy danych
POSTGRES_DB - nazwa bazy danych
POSTGRES_HOST - adres bazy danych

Przykład pliku .env:

```bash
POSTGRES_USER="tagtron"
POSTGRES_PASSWORD="secret_password"
POSTGRES_DB="tagtrondb"
POSTGRES_HOST="postgresql-tagtron-db"
```

## Przykłady Użycia API

Aplikacja udostępnia interaktywną dokumentację API pod adresem <http://localhost:8000/docs>, gdzie można testować endpointy bezpośrednio z przeglądarki.

## Obsługa Błędów

W przypadku błędów aplikacja zwraca odpowiedzi z kodami statusu HTTP oraz szczegółowymi informacjami o błędzie.

Przykład odpowiedzi w przypadku błędu:

```json
{
    "detail": "Błąd autoryzacji"
}
```

## Bezpieczeństwo

Aplikacja korzysta z JSON Web Tokens (JWT) do autoryzacji użytkowników, zapewniając w ten sposób bezpieczny sposób weryfikacji tożsamości. Proces autoryzacji rozpoczyna się od zalogowania użytkownika, w wyniku którego generowany jest token JWT. Token ten jest następnie wymagany do autoryzacji wszystkich kolejnych żądań, które wymagają dostępu do chronionych zasobów aplikacji. Do każdego żądania użytkownik musi dołączyć token w nagłówku HTTP, co pozwala na weryfikację tożsamości i przypisanie odpowiednich uprawnień.

### Proces logowania i generowania tokenów

Proces logowania w aplikacji obejmuje następujące kroki:

1. Autentykacja użytkownika:
    - Użytkownik podaje swoje dane logowania (nazwisko użytkownika i hasło). Funkcja authenticate_user sprawdza, czy użytkownik o podanej nazwie istnieje w bazie danych oraz czy podane hasło pasuje do zapisanych danych (przechowywanych w formie zahashowanej).
2. Generowanie tokenu:
    - Po pomyślnym zalogowaniu użytkownika, aplikacja generuje token JWT za pomocą funkcji create_access_token. Token zawiera dane użytkownika (takie jak nazwa użytkownika, identyfikator użytkownika i jego rola) oraz czas wygaśnięcia tokenu. Token jest następnie kodowany za pomocą klucza sekretnego i algorytmu HS256.
