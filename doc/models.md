# Modele Danych

W projekcie **Tagtron** wykorzystujemy [SQLAlchemy](https://www.sqlalchemy.org/) jako ORM (Object-Relational Mapping) do mapowania klas Pythona na tabele w bazie danych PostgreSQL. Poniżej przedstawiamy kluczowe modele danych zdefiniowane w pliku `models.py`.

## Importy

Na początku pliku `models.py` znajdują się niezbędne importy:

```python
from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

    Column, Integer, String, ForeignKey, Table: Funkcje i klasy z SQLAlchemy służące do definiowania kolumn tabeli oraz ich typów.
    relationship: Funkcja umożliwiająca definiowanie relacji pomiędzy tabelami.
    Base: Bazowa klasa deklaratywna dla modeli, zdefiniowana w module database.

Tabela Asocjacyjna image_tags

Aby zrealizować relację wiele-do-wielu pomiędzy obrazami a etykietami, definiujemy tabelę asocjacyjną image_tags:

image_tags = Table(
    "image_tags",
    Base.metadata,
    Column("image_id", Integer, ForeignKey("images.id")),
    Column("tag_id", Integer, ForeignKey("tags.id"))
)

    image_id: Identyfikator obrazu, klucz obcy do tabeli images.
    tag_id: Identyfikator etykiety, klucz obcy do tabeli tags.

Klasa User

Model User reprezentuje użytkowników aplikacji.

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    projects = relationship("Project", back_populates="owner")

    id: Unikalny identyfikator użytkownika.
    username: Nazwa użytkownika, unikalna w systemie.
    email: Adres e-mail użytkownika, również unikalny.
    hashed_password: Zahaszowane hasło użytkownika.
    projects: Relacja jeden-do-wielu z modelem Project, wskazująca na projekty utworzone przez użytkownika.

Klasa Project

Model Project reprezentuje projekty tworzone przez użytkowników.

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="projects")
    images = relationship("Image", back_populates="project")

    id: Unikalny identyfikator projektu.
    title: Tytuł projektu.
    description: Opis projektu.
    owner_id: Identyfikator właściciela projektu, klucz obcy do tabeli users.
    owner: Relacja wiele-do-jednego z modelem User, wskazująca na właściciela projektu.
    images: Relacja jeden-do-wielu z modelem Image, wskazująca na obrazy należące do projektu.

Klasa Image

Model Image reprezentuje obrazy dodawane do projektów.

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="images")
    tags = relationship("Tag", secondary=image_tags, back_populates="images")

    id: Unikalny identyfikator obrazu.
    filename: Nazwa pliku obrazu.
    project_id: Identyfikator projektu, do którego należy obraz, klucz obcy do tabeli projects.
    project: Relacja wiele-do-jednego z modelem Project, wskazująca na projekt, do którego należy obraz.
    tags: Relacja wiele-do-wielu z modelem Tag, wskazująca na etykiety przypisane do obrazu.

Klasa Tag

Model Tag reprezentuje etykiety przypisywane do obrazów.

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    images = relationship("Image", secondary=image_tags, back_populates="tags")

    id: Unikalny identyfikator etykiety.
    name: Nazwa etykiety, unikalna w systemie.
    images: Relacja wiele-do-wielu z modelem Image, wskazująca na obrazy oznaczone daną etykietą.

Schemat Bazy Danych

Poniżej przedstawiono schemat bazy danych, ilustrujący relacje pomiędzy tabelami:

+-------------+       +-------------+       +-------------+      
::contentReference[oaicite:0]{index=0}
 
