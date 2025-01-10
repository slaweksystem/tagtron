import React, { useState, useRef } from "react";

const Canvas = ({ projectDescription, projectId }) => {
  const [image, setImage] = useState(null); // Przechowywane wybrane zdjęcie
  const [rectangle, setRectangle] = useState(null); // Dane prostokąta
  const [drawing, setDrawing] = useState(false); // Status rysowania
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Początkowa pozycja rysowania
  const [endPos, setEndPos] = useState({ x: 0, y: 0 }); // Końcowa pozycja rysowania
  const [labelInput, setLabelInput] = useState(""); // Nazwa prostokąta
  const [imagePath, setImagePath] = useState(""); // Ścieżka do podglądu zdjęcia
  const [users, setUsers] = useState([]); // Lista użytkowników projektu
  const canvasRef = useRef(null);

  // Funkcja do ładowania obrazu
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePath(URL.createObjectURL(file));
    }
  };

  // Obsługa rysowania prostokątów
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setDrawing(true);
    setLabelInput("");
  };

  const handleMouseUp = (e) => {
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

    setEndPos({ x, y });
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

  // Obsługa wysyłania zdjęcia do API
  const handleImageSubmit = async () => {
    if (!image) {
      alert("Nie wybrano obrazu!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("project_id", projectId);

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/images/${projectId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status}`);
      }

      const data = await response.json();
      alert("Zdjęcie zostało dodane do bazy danych!");
      setImage(null);
      setImagePath("");
    } catch (error) {
      console.error("Błąd podczas dodawania zdjęcia:", error);
      alert("Wystąpił błąd podczas dodawania zdjęcia.");
    }
  };

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

  // Obsługa zmiany tekstu w polu nazwy prostokąta
  const handleLabelInputChange = (e) => {
    setLabelInput(e.target.value);
  };

  // Obsługa zatwierdzenia nazwy prostokąta
  const handleLabelSubmit = async () => {
    if (!startPos || !endPos || !labelInput) {
      alert("Proszę dodać prostokąt i podać jego nazwę.");
      return;
    }

    const payload = {
      label: labelInput,
      position_x1: startPos.x,
      position_y1: startPos.y,
      position_x2: endPos.x,
      position_y2: endPos.y,
    };

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      console.log(payload);
      const response = await fetch(
        `http://localhost:8000/images/labels/${projectId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Błąd API: ${response.status}`);
      }

      const data = await response.json();
      alert(`Prostokąt został zapisany z nazwą: ${data.label}`);
      setRectangle(null); // Resetowanie prostokąta
      setStartPos({ x: 0, y: 0 }); // Resetowanie pozycji początkowej
      setEndPos({ x: 0, y: 0 }); // Resetowanie pozycji końcowej
      setLabelInput(""); // Czyszczenie pola tekstowego
    } catch (error) {
      console.error("Błąd podczas wysyłania prostokąta:", error);
      alert("Wystąpił błąd podczas zapisywania prostokąta.");
    }
  };

  return (
    <div>
      <h3 style={{ textAlign: "center" }}>Opis projektu:</h3>
      <p style={{ textAlign: "center", fontStyle: "italic" }}>
        {projectDescription}
      </p>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imagePath && (
        <div>
          <p>Wybrano plik: {imagePath}</p>
          <button onClick={handleImageSubmit}>Dodaj obraz do bazy</button>
        </div>
      )}

      <div
        ref={canvasRef}
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          border: "1px solid black",
          cursor: "crosshair",
          backgroundImage: imagePath ? `url(${imagePath})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {rectangle && (
          <div
            style={{
              position: "absolute",
              left: rectangle.x,
              top: rectangle.y,
              width: Math.abs(rectangle.width),
              height: Math.abs(rectangle.height),
              backgroundColor: "rgba(0, 128, 255, 0.3)",
              border: "1px solid rgba(0, 128, 255, 0.8)",
            }}
          >
            {labelInput && (
              <span
                style={{
                  position: "absolute",
                  top: -20,
                  left: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  padding: "2px 5px",
                  fontSize: "12px",
                  borderRadius: "3px",
                }}
              >
                {labelInput}
              </span>
            )}
          </div>
        )}
      </div>

      {rectangle && (
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            value={labelInput}
            onChange={handleLabelInputChange}
            placeholder="Podaj nazwę prostokąta"
            style={{ padding: "5px" }}
          />
          <button
            onClick={handleLabelSubmit}
            style={{ padding: "5px 10px", marginLeft: "10px" }}
          >
            Zatwierdź
          </button>
        </div>
      )}

      <button
        onClick={handleGetUsers}
        style={{ marginTop: "20px", padding: "10px" }}
      >
        Pobierz użytkowników
      </button>

      {users.length > 0 && (
        <ul style={{ marginTop: "20px" }}>
          {users.map((user) => (
            <li key={user.id}>
              {user.first_name} {user.last_name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Canvas;
