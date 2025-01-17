import React, { useState, useEffect, useRef } from "react";
import ImageUploadModal from "./ImageUploadModal"; // Importujemy komponent ImageUploadModal
import UserAddModal from "./UserAddModal";

const Canvas = ({ projectDescription, projectId, projectTitle }) => {
  const [images, setImages] = useState([]); // Lista obrazów
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Indeks aktualnie wyświetlanego obrazu
  const [imagePath, setImagePath] = useState(""); // Ścieżka do obrazu
  const [rectangle, setRectangle] = useState(null); // Dane prostokąta
  const [drawing, setDrawing] = useState(false); // Status rysowania
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Początkowa pozycja rysowania
  const [endPos, setEndPos] = useState({ x: 0, y: 0 }); // Końcowa pozycja rysowania
  const [labelInput, setLabelInput] = useState(""); // Nazwa prostokąta
  const [label, setLabel] = useState(null); // Przechowuje etykietę prostokąta
  const [users, setUsers] = useState([]); // Lista użytkowników projektu
  const [showImageUploadModal, setShowImageUploadModal] = useState(false); // Stan do wyświetlania modala
  const [showUserAddModal, setShowUserAddModal] = useState(false);

  const canvasRef = useRef(null);

  // Załaduj użytkowników i obrazy po załadowaniu komponentu
  useEffect(() => {
    handleGetUsers();
    handleGetImages();
  }, []);

  // Pobieranie użytkowników projektu
  const handleGetUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/projects/users/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników:", error);
      alert("Wystąpił błąd podczas pobierania użytkowników.");
    }
  };

  // Pobieranie listy obrazów z serwera
  const handleGetImages = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/images/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status}`);
      }

      const data = await response.json();
      console.log("Odpowiedź serwera:", data);

      if (data && Array.isArray(data) && data.length > 0) {
        setImages(data);
        loadImage(data[0].id); // Załaduj pierwszy obraz
      } else {
        throw new Error("Brak dostępnych obrazów.");
      }
    } catch (error) {
      console.error("Błąd podczas pobierania obrazów:", error);
      alert("Wystąpił błąd podczas pobierania obrazów.");
    }
  };

  // Ładowanie obrazu na podstawie ID
  const loadImage = async (imageId) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/images/view/${imageId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImagePath(url);
    } catch (error) {
      console.error("Błąd podczas ładowania obrazu:", error);
      alert("Wystąpił błąd podczas ładowania obrazu.");
    }
  };

  // Obsługa rysowania prostokątków
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setDrawing(true);
  };

  const handleMouseUp = (e) => {
    if (!drawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setEndPos({ x, y }); // Zapisywanie końcowej pozycji
    setRectangle({
      x: startPos.x,
      y: startPos.y,
      width: x - startPos.x,
      height: y - startPos.y,
    });

    setDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setRectangle({
      x: startPos.x,
      y: startPos.y,
      width: x - startPos.x,
      height: y - startPos.y,
    });
  };

  // Funkcja do nadawania etykiety
  const handleLabelChange = (e) => {
    setLabelInput(e.target.value);
    setLabel(e.target.value); // Aktualizowanie etykiety na bieżąco
  };

  // Funkcja do zapisywania etykiety w bazie
  const handleSaveLabel = async () => {
    // Sprawdź, czy etykieta i prostokąt zostały poprawnie narysowane
    if (!label || !rectangle) {
      alert("Proszę podać etykietę i narysować prostokąt.");
      return;
    }

    // Przygotowanie danych do wysłania, zgodnie z wymaganiami API
    const labelRequest = {
      label: label,
      position_x1: Math.round(startPos.x), // Upewnij się, że wartości są liczbami całkowitymi
      position_y1: Math.round(startPos.y),
      position_x2: Math.round(endPos.x),
      position_y2: Math.round(endPos.y),
    };

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/images/labels/${images[currentImageIndex].id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(labelRequest),
        }
      );

      if (!response.ok) {
        const errorData = await response.json(); // Pobierz dane o błędzie z serwera
        throw new Error(
          `Błąd: ${response.status}, ${errorData.detail || errorData.message}`
        );
      }

      // Jeśli zapis zakończony pomyślnie, usuń prostokąt, etykietę i wyczyść pole tekstowe
      setRectangle(null); // Usuwamy prostokąt
      setLabel(null); // Usuwamy etykietę
      setLabelInput(""); // Wyczyść pole tekstowe

      alert("Etykieta zapisana pomyślnie!");
    } catch (error) {
      console.error("Błąd podczas zapisywania etykiety:", error);
      alert("Wystąpił błąd podczas zapisywania etykiety.");
    }
  };

  // Funkcja do zmiany zdjęć
  const handleChangeImage = (direction) => {
    const newIndex = currentImageIndex + direction;

    // Sprawdzenie, czy nowy indeks jest w dozwolonym zakresie
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentImageIndex(newIndex); // Zmiana indeksu
      loadImage(images[newIndex].id); // Załaduj obraz na podstawie nowego indeksu
    }
  };

  // Wyświetlanie użytkowników projektu
  const renderUsers = () => (
    <div>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.first_name} {user.last_name} ({user.email})
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak użytkowników w projekcie.</p>
      )}
    </div>
  );

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Opis projektu:</h3>
      <p style={{ textAlign: "center", fontStyle: "italic" }}>
        {projectDescription}
      </p>

      {/* Przyciski do dodania obrazu */}
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={() => setShowImageUploadModal(true)}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Dodaj zdjęcie do bazy
        </button>
      </div>

      {/* Modal do przesyłania obrazu */}
      {showImageUploadModal && (
        <ImageUploadModal
          projectId={projectId}
          onClose={() => {
            setShowImageUploadModal(false); // Zamknij modal
            handleGetImages(); // Odśwież listę obrazów
          }}
        />
      )}

      {/* Ekran do rysowania prostokątków */}
      {imagePath ? (
        <div
          ref={canvasRef}
          style={{
            position: "relative",
            width: "300px",
            height: "300px",
            border: "1px solid black",
            cursor: "crosshair",
            backgroundImage: `url(${imagePath})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {rectangle && (
            <div
              style={{
                position: "absolute",
                border: "2px solid red",
                top: rectangle.y,
                left: rectangle.x,
                width: rectangle.width,
                height: rectangle.height,
              }}
            >
              {/* Wyświetlanie etykiety nad prostokątem */}
              {label && (
                <div
                  style={{
                    position: "absolute",
                    top: -20, // Nad prostokątem
                    left: rectangle.width / 2,
                    transform: "translateX(-50%)",
                    color: "white",
                    fontWeight: "bold",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  }}
                >
                  {label}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <p>Brak obrazów w projekcie</p>
      )}

      {/* Formularz do nadawania etykiety */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <input
          type="text"
          value={labelInput}
          onChange={handleLabelChange}
          placeholder="Wpisz etykietę"
          style={{
            padding: "5px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleSaveLabel}
          style={{
            padding: "5px 10px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Zapisz etykietę
        </button>
      </div>

      {/* Zmiana obrazu */}
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <button
          onClick={() => handleChangeImage(-1)}
          style={{
            padding: "5px 10px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Poprzednie
        </button>
        <span style={{ margin: "0 10px" }}>
          {currentImageIndex + 1} / {images.length}
        </span>
        <button
          onClick={() => handleChangeImage(1)}
          style={{
            padding: "5px 10px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Następne
        </button>
      </div>

      {/* Lista użytkowników */}
      <div style={{ marginTop: "20px" }}>
        <h3>Użytkownicy w projekcie:</h3>
        {renderUsers()}
        <button
          onClick={() => setShowUserAddModal(true)}
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Dodaj użytkownika
        </button>
      </div>
      {showUserAddModal && (
        <UserAddModal
          projectTitle={projectTitle}
          onClose={() => {
            setShowUserAddModal(false);
            handleGetUsers(); // Odśwież listę użytkowników
          }}
        />
      )}
    </div>
  );
};

export default Canvas;
