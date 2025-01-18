# Dokumentacja API

Backend projektu **Tagtron** został zbudowany przy użyciu frameworka [FastAPI](https://fastapi.tiangolo.com/), co umożliwia tworzenie szybkich i nowoczesnych interfejsów API w języku Python.

## Spis Treści

- [Autoryzacja](#autoryzacja)
- [Użytkownicy](#użytkownicy)
- [Projekty](#projekty)
- [Obrazy](#obrazy)
- [Etykiety](#etykiety)

## Autoryzacja

Endpointy związane z autoryzacją użytkowników.

### Rejestracja Użytkownika

- **Endpoint**: `/auth/register`
- **Metoda**: `POST`
- **Opis**: Rejestruje nowego użytkownika w systemie.
- **Body**:

  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }

    Odpowiedź:

    {
      "id": "integer",
      "username": "string",
      "email": "string"
    }

Logowanie Użytkownika

    Endpoint: /auth/login

    Metoda: POST

    Opis: Uwierzytelnia użytkownika i zwraca token dostępu.

    Body:

{
  "username": "string",
  "password": "string"
}

Odpowiedź:

    {
      "access_token": "string",
      "token_type": "bearer"
    }

Użytkownicy

Endpointy do zarządzania danymi użytkowników.
Pobierz Informacje o Użytkowniku

    Endpoint: /users/{user_id}

    Metoda: GET

    Opis: Zwraca informacje o użytkowniku na podstawie jego ID.

    Parametry:
        user_id (integer): ID użytkownika.

    Odpowiedź:

    {
      "id": "integer",
      "username": "string",
      "email": "string",
      "projects": [
        {
          "id": "integer",
          "title": "string",
          "description": "string"
        }
      ]
    }

Projekty

Endpointy do zarządzania projektami.
Utwórz Nowy Projekt

    Endpoint: /projects/

    Metoda: POST

    Opis: Tworzy nowy projekt dla zalogowanego użytkownika.

    Body:

{
  "title": "string",
  "description": "string"
}

Odpowiedź:

    {
      "id": "integer",
      "title": "string",
      "description": "string",
      "owner_id": "integer"
    }

Pobierz Listę Projektów

    Endpoint: /projects/

    Metoda: GET

    Opis: Zwraca listę wszystkich projektów zalogowanego użytkownika.

    Odpowiedź:

    [
      {
        "id": "integer",
        "title": "string",
        "description": "string",
        "owner_id": "integer"
      }
    ]

Pobierz Szczegóły Projektu

    Endpoint: /projects/{project_id}

    Metoda: GET

    Opis: Zwraca szczegółowe informacje o projekcie na podstawie jego ID.

    Parametry:
        project_id (integer): ID projektu.

    Odpowiedź:

    {
      "id": "integer",
      "title": "string",
      "description": "string",
      "owner_id": "integer",
      "images": [
        {
          "id": "integer",
          "filename": "string"
        }
      ]
    }

Obrazy

Endpointy do zarządzania obrazami w projektach.
Dodaj Obraz do Projektu

    Endpoint: /projects/{project_id}/images/

    Metoda: POST

    Opis: Dodaje nowy obraz do określonego projektu.

    Parametry:
        project_id (integer): ID projektu.

    Body:

{
  "filename": "string"
}

Odpowiedź:

    {
      "id": "integer",
      "filename": "string",
      "project_id": "integer"
    }

Pobierz Listę Obrazów w Projekcie

    Endpoint: /projects/{project_id}/images/

    Metoda: GET

    Opis: Zwraca listę wszystkich obrazów w określonym projekcie.

    Parametry:
        project_id (integer): ID projektu.

    Odpowiedź:

[
  {
    "id": "integer",
    "filename": "string",
    "project_id": "integer"
  }
]
