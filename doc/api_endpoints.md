# Dokumentacja API

## Spis treści

- [Wprowadzenie](#wprowadzenie)
- [Autoryzacja](#autoryzacja)
- [Endpointy](#endpointy)
  - [GET /projects](#get-projects)
  - [POST /projects](#post-projects)
  - [GET /projects/{id}](#get-projects-id)
  - [PUT /projects/{id}](#put-projects-id)
  - [DELETE /projects/{id}](#delete-projects-id)
  - [POST /projects/{id}/images](#post-projects-id-images)
  - [GET /projects/{id}/images](#get-projects-id-images)
  - [POST /projects/{id}/labels](#post-projects-id-labels)
  - [GET /projects/{id}/labels](#get-projects-id-labels)

## Wprowadzenie

API backendu Tagtron umożliwia zarządzanie projektami, obrazami oraz etykietami. Poniżej przedstawiono dostępne endpointy oraz ich funkcjonalności.

## Autoryzacja

Obecna wersja API nie wymaga autoryzacji.

## Endpointy

### GET /projects

**Opis:** Pobiera listę wszystkich projektów.

**Odpowiedź:**

```json
[
  {
    "id": 1,
    "name": "Przykładowy Projekt",
    "description": "Opis projektu",
    "created_at": "2025-01-17T20:25:55"
  }
]
```

### POST /projects

**Opis:** Tworzy nowy projekt.

**Żadanie:**

```json
{
  "name": "Nowy Projekt",
  "description": "Opis nowego projektu"
}
```

**Odpowiedź:**

```json
{
  "id": 2,
  "name": "Nowy Projekt",
  "description": "Opis nowego projektu",
  "created_at": "2025-01-17T20:30:00"
}
```

### GET /projects/{id}

**Opis:** Pobiera szczegóły projektu o podanym ID.

**Odpowiedź:**

```json
{
  "id": 1,
  "name": "Przykładowy Projekt",
  "description": "Opis projektu",
  "created_at": "2025-01-17T20:25:55"
}
```

### PUT /projects/{id}

**Opis:** Aktualizuje informacje o projekcie o podanym ID.

**Żadanie:**

```json
{
  "name": "Zaktualizowany Projekt",
  "description": "Zaktualizowany opis projektu"
}
```

**Odpowiedź:**

```json
{
  "id": 1,
  "name": "Zaktualizowany Projekt",
  "description": "Zaktualizowany opis projektu",
  "created_at": "2025-01-17T20:25:55"
}
```

### DELETE /projects/{id}

**Opis:** Usuwa projekt o podanym ID.

**Odpowiedź:**

```json
{
  "detail": "Projekt usunięty pomyślnie."
}
```

### POST /projects/{id}/images

**Opis:** Dodaje nowy obraz do projektu o podanym ID.

**Żadanie:**

```json
{
  "image_url": "http://example.com/obraz.jpg",
  "description": "Opis obrazu"
}
```

**Odpowiedź:**

```json
{
  "id": 1,
  "project_id": 1,
  "image_url": "http://example.com/obraz.jpg",
  "description": "Opis obrazu",
  "uploaded_at": "2025-01-17T20:35:00"
}
```

### GET /projects/{id}/images

**Opis:** Pobiera listę obrazów w projekcie o podanym ID.

**Odpowiedź:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "image_url": "http://example.com/obraz.jpg",
    "description": "Opis obrazu",
    "uploaded_at": "2025-01-17T20:35:00"
  }
]
```

### POST /projects/{id}/labels

**Opis:** Dodaje nową etykietę do projektu o podanym ID.

**Żadanie:**

```json
{
  "name": "Nowa Etykieta",
  "color": "#FF0000"
}
```

**Odpowiedź:**

```json
{
  "id": 1,
  "project_id": 1,
  "name": "Nowa Etykieta",
  "color": "#FF0000"
}
```

### GET /projects/{id}/labels

**Opis:** Pobiera listę etykiet w projekcie o podanym ID.

**Odpowiedź:**

```json
[
  {
    "id": 1,
    "project_id": 1,
    "name": "Nowa Etykieta",
    "color": "#FF0000"
  }
]
