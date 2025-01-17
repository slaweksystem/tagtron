import React, { useState } from "react";

const ImageUploadModal = ({ projectId, onClose }) => {
  const [image, setImage] = useState(null);
  const [imagePath, setImagePath] = useState(""); // Podgląd obrazu

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        alert("Nieobsługiwany format pliku. Wybierz obraz JPEG lub PNG.");
        return;
      }
      setImage(file);
      setImagePath(URL.createObjectURL(file));
    }
  };

  const handleImageSubmit = async () => {
    if (!image) {
      alert("Nie wybrano obrazu!");
      return;
    }

    const formData = new FormData();
    formData.append("file", image); // Upewnij się, że nazwa pola to "file", zgodnie z API

    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/images/${projectId}`, // Użyj projectId w URL
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData, // Przesyłanie obrazu jako część formularza
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Błąd odpowiedzi serwera:", errorData); // Zapisz błąd serwera
        throw new Error(`Błąd: ${response.status}`);
      }

      // Sprawdzamy, czy odpowiedź nie zawiera treści (status 204)
      if (response.status === 204) {
        // Obsługuje brak treści w odpowiedzi, ale uznaje to za sukces
        alert("Obraz został pomyślnie dodany do bazy!");
        onClose(); // Zamknij modal po dodaniu obrazu
        return; // Zakończ funkcję
      }

      // Jeśli odpowiedź zawiera treść, traktujemy ją jako dane
      const responseData = await response.json();
      console.log("Obraz dodany:", responseData);

      alert("Obraz został pomyślnie dodany do bazy!");
      onClose(); // Zamknij modal po dodaniu obrazu
    } catch (error) {
      console.error("Błąd podczas dodawania obrazu:", error);
      alert("Wystąpił błąd podczas dodawania obrazu.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Ustawiamy półprzezroczyste tło dla modalu
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ustawienie wyższego z-index, aby modal był na wierzchu
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          width: "400px",
          zIndex: 1001, // Zapewnienie, że zawartość modalu (przycisk itp.) jest nad tłem
        }}
      >
        <h3>Dodaj obraz</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginBottom: "20px" }}
        />
        {imagePath && (
          <div>
            <img src={imagePath} alt="Podgląd" style={{ maxWidth: "100%" }} />
          </div>
        )}
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={handleImageSubmit}
            style={{ padding: "10px", marginRight: "10px" }}
          >
            Dodaj obraz
          </button>
          <button onClick={onClose} style={{ padding: "10px" }}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
