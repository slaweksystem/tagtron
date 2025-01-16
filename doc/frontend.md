
# Frontend
---
### Dokumentacja interfejsu użytkownika

## Strona rejestracji
Poniżej znajduje się podgląd strony rejestracji:

![Strona rejestracji](../media/strona-rejestracji.png)

## Strona logowania
Poniżej znajduje się podgląd strony logowania:

![Strona logowania](../media/strona-logowania.png)

## Struktura Plików w Folderze `src`
Folder `src` zawiera komponenty React oraz inne elementy wspierające frontend aplikacji. Poniżej opis najważniejszych plików i komponentów:

### Główne komponenty:
- **AccountScreen.jsx**: Ekran profilu użytkownika, umożliwiający zarządzanie danymi użytkownika.
- **AddGroupModal.jsx**: Komponent modalny (wyskakujące okno) służący do dodawania nowych grup.
- **App.jsx**: Główny komponent aplikacji, odpowiedzialny za zarządzanie routowaniem i strukturą aplikacji.
- **Canvas.jsx**: Prawdopodobnie obsługuje interaktywne płótno, np. do rysowania lub wizualizacji.
- **Content.jsx**: Komponent obsługujący główną treść wyświetlaną w aplikacji.
- **Header.jsx**: Nagłówek aplikacji, może zawierać logo, menu nawigacyjne lub inne elementy stałe.
- **Login.jsx**: Formularz logowania, umożliwiający uwierzytelnienie użytkownika.
- **Register.jsx**: Formularz rejestracji dla nowych użytkowników.
- **ProjectsScreen.jsx**: Ekran zarządzania projektami, wyświetlający listę projektów i szczegóły.
- **Menu.jsx**: Menu boczne lub nawigacyjne aplikacji.

### Pozostałe pliki i foldery:
- **assets/**: Folder z zasobami statycznymi, np. obrazkami lub ikonami.
- **main.jsx**: Główny plik uruchamiający aplikację React.
- **App.css**: Plik stylów CSS powiązany z aplikacją.

## Technologie:
Frontend aplikacji jest oparty na:
- React: biblioteka do budowy interfejsów użytkownika.
- Vite: narzędzie do szybkiego budowania i uruchamiania aplikacji.

## Funkcjonalności:
1. Obsługa użytkowników (logowanie, rejestracja, zarządzanie kontem).
2. Zarządzanie projektami i grupami.
3. Interaktywne elementy wizualne (np. Canvas).

## Instrukcja Użycia:
1. **Instalacja zależności:** Wykonaj `npm install` w folderze `frontend`.
2. **Uruchomienie aplikacji:** Użyj `npm run dev`, aby uruchomić aplikację w trybie deweloperskim.

