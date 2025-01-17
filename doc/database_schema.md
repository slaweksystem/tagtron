# Schemat Bazy Danych

## Wprowadzenie

Baza danych backendu Tagtron jest kluczowym elementem systemu, umożliwiającym przechowywanie informacji o projektach, obrazach oraz etykietach. Poniżej przedstawiono strukturę tabel, ich relacje oraz opis każdej kolumny.

## Tabele i Relacje

Schemat bazy danych składa się z trzech głównych tabel:

1. **projects** - tabela przechowująca informacje o projektach.
2. **images** - tabela przechowująca dane o obrazach powiązanych z projektami.
3. **labels** - tabela przechowująca informacje o etykietach przypisanych do projektów.

Relacje:
- **projects** posiada relację jeden-do-wielu z tabelą **images**.
- **projects** posiada relację jeden-do-wielu z tabelą **labels**.

---

## Szczegółowy Opis Tabel

### Tabela: projects

| Kolumna      | Typ        | Opcje                 | Opis                                  |
|--------------|------------|-----------------------|---------------------------------------|
| id           | INTEGER    | PRIMARY KEY, AUTOINCREMENT | Unikalny identyfikator projektu.      |
| name         | TEXT       | NOT NULL             | Nazwa projektu.                      |
| description  | TEXT       | NULLABLE             | Opis projektu.                       |
| created_at   | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Data utworzenia projektu.            |

### Tabela: images

| Kolumna      | Typ        | Opcje                 | Opis                                  |
|--------------|------------|-----------------------|---------------------------------------|
| id           | INTEGER    | PRIMARY KEY, AUTOINCREMENT | Unikalny identyfikator obrazu.        |
| project_id   | INTEGER    | NOT NULL, FOREIGN KEY | ID projektu, do którego należy obraz. |
| image_url    | TEXT       | NOT NULL             | URL obrazu.                          |
| description  | TEXT       | NULLABLE             | Opis obrazu.                         |
| uploaded_at  | TIMESTAMP  | DEFAULT CURRENT_TIMESTAMP | Data dodania obrazu.                 |

Relacja: **project_id** jest kluczem obcym odwołującym się do kolumny **id** w tabeli **projects**.

### Tabela: labels

| Kolumna      | Typ        | Opcje                 | Opis                                  |
|--------------|------------|-----------------------|---------------------------------------|
| id           | INTEGER    | PRIMARY KEY, AUTOINCREMENT | Unikalny identyfikator etykiety.      |
| project_id   | INTEGER    | NOT NULL, FOREIGN KEY | ID projektu, do którego należy etykieta. |
| name         | TEXT       | NOT NULL             | Nazwa etykiety.                      |
| color        | TEXT       | NOT NULL             | Kolor etykiety w formacie HEX (#RRGGBB). |

Relacja: **project_id** jest kluczem obcym odwołującym się do kolumny **id** w tabeli **projects**.

---

## Diagram Relacji

```plaintext
projects
    | 1
    |│
    |↳ *
images

projects
    | 1
    |│
    |↳ *
labels
```

---

## Przykładowe Zapytania SQL

### Tworzenie Tabel

```sql
CREATE TABLE projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects (id)
);

CREATE TABLE labels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id)
);
```

### Przykładowe Zapytanie SELECT

Pobranie wszystkich obrazów dla projektu o ID 1:

```sql
SELECT * FROM images WHERE project_id = 1;
```

Pobranie wszystkich etykiet dla projektu o ID 1:

```sql
SELECT * FROM labels WHERE project_id = 1;
```

---

## Podsumowanie

Schemat bazy danych jest zoptymalizowany pod kątem zarządzania projektami, obrazami oraz etykietami. Struktura jest elastyczna i pozwala na łatwe rozszerzanie funkcjonalności w przyszłości.
