# Dokumentacja Backendowa Tagtron

## Spis Treści

1. [Instalacja i Uruchomienie](#instalacja-i-uruchomienie)
2. [Struktura Projektu](#struktura-projektu)
3. [Modele Danych](#modele-danych)
4. [Testowanie](#testowanie)
5. [Konfiguracja Środowiska](#konfiguracja-środowiska)
6. [Przykłady Użycia API](#przykłady-użycia-api)
7. [Obsługa Błędów](#obsługa-błędów)
8. [Bezpieczeństwo](#bezpieczeństwo)
9. [Wymagania Systemowe](#wymagania-systemowe)
10. [Licencja](#licencja)

## Instalacja i Uruchomienie

1. **Klonowanie Repozytorium**

   ```bash
   git clone https://github.com/slaweksystem/tagtron.git
   cd tagtron
Instalacja Zależności

Użyj pip do zainstalowania wymaganych pakietów:

bash
Kopiuj
Edytuj
pip install -r requirements.txt
Uruchomienie Serwera

Aby uruchomić serwer lokalnie:

bash
Kopiuj
Edytuj
uvicorn main:app --host 0.0.0.0 --port 8000
Serwer będzie dostępny pod adresem http://localhost:8000.

Struktura Projektu
Projekt jest zorganizowany w następujący sposób:

css
Kopiuj
Edytuj
tagtron/
├── app/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── crud.py
│   └── database.py
├── requirements.txt
└── README.md
main.py: Główny plik aplikacji FastAPI.
models.py: Definicje modeli danych z użyciem SQLAlchemy.
schemas.py: Schematy Pydantic do walidacji danych wejściowych i wyjściowych.
crud.py: Funkcje do interakcji z bazą danych.
database.py: Konfiguracja połączenia z bazą danych.
requirements.txt: Lista wymaganych pakietów.
README.md: Dokumentacja projektu.
Modele Danych
Projekt wykorzystuje SQLAlchemy jako ORM do interakcji z bazą danych.

Przykład modelu użytkownika:

python
Kopiuj
Edytuj
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
Testowanie
Do testowania aplikacji używamy frameworka pytest.

Instalacja

bash
Kopiuj
Edytuj
pip install pytest
Uruchamianie Testów

Aby uruchomić testy:

bash
Kopiuj
Edytuj
pytest
Więcej informacji na temat pytest można znaleźć w oficjalnej dokumentacji: 
PYTEST

Konfiguracja Środowiska
Aplikacja wymaga następujących zmiennych środowiskowych:

DATABASE_URL: URL połączenia z bazą danych.
SECRET_KEY: Klucz do podpisywania tokenów JWT.
Przykład pliku .env:

bash
Kopiuj
Edytuj
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your_secret_key
Przykłady Użycia API
Aplikacja udostępnia interaktywną dokumentację API pod adresem http://localhost:8000/docs, gdzie można testować endpointy bezpośrednio z przeglądarki.

Obsługa Błędów
W przypadku błędów aplikacja zwraca odpowiedzi z kodami statusu HTTP oraz szczegółowymi informacjami o błędzie.

Przykład odpowiedzi w przypadku błędu:

json
Kopiuj
Edytuj
{
    "detail": "Błąd autoryzacji"
}
Bezpieczeństwo
Aplikacja wykorzystuje JWT do autoryzacji użytkowników. Tokeny są generowane podczas logowania i muszą być dołączane do nagłówków żądań wymagających autoryzacji.

Wymagania Systemowe
Aplikacja wymaga Pythona w wersji 3.8 lub wyższej oraz zainstalowanych następujących pakietów:

fastapi
uvicorn
sqlalchemy
pydantic
pytest
Licencja
Projekt jest dostępny na licencji MIT.

css
Kopiuj
Edytuj

Powyższa dokumentacja powinna być pomocna w zrozumieniu struktury i konfiguracji backendu projektu **Tagtron**.
::contentReference[oaicite:1]{index=1}
 






