import React, { useState, useRef } from "react";

const Canvas = () => {
  const [image, setImage] = useState(null); // Przechowuje załadowane zdjęcie
  const [rectangle, setRectangle] = useState(null); // Przechowuje dane prostokąta
  const [drawing, setDrawing] = useState(false); // Kontroluje, czy użytkownik rysuje
  const [startPos, setStartPos] = useState({ x: 0, y: 0 }); // Pozycja początkowa rysowania
  const [endPos, setEndPos] = useState({ x: 0, y: 0 }); // Pozycja końcowa rysowania
  const [labelInput, setLabelInput] = useState(""); // Obsługuje wartość pola tekstowego dla nazwy
  const canvasRef = useRef(null);

  // Funkcja do ładowania zdjęcia
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setDrawing(true);
    setLabelInput(""); // Wyczyść pole tekstowe przy rozpoczęciu nowego rysowania
  };

  const handleMouseUp = (e) => {
    if (!drawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Ustawienie prostokąta z pozycją i wymiarami
    setRectangle({
      x: startPos.x,
      y: startPos.y,
      width: x - startPos.x,
      height: y - startPos.y,
    });

    setEndPos({ x, y }); // Zapisanie pozycji końcowej
    setDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Dynamiczna aktualizacja prostokąta
    setRectangle({
      x: startPos.x,
      y: startPos.y,
      width: x - startPos.x,
      height: y - startPos.y,
    });
  };

  // Obsługa zmiany wartości pola tekstowego do wpisania nazwy
  const handleLabelInputChange = (e) => {
    setLabelInput(e.target.value);
  };

  // Obsługa zatwierdzenia nazwy prostokąta
  const handleLabelSubmit = () => {
    alert(`Prostokąt zapisany z nazwą: ${labelInput}`);
    setImage(null); // Resetowanie zdjęcia
    setRectangle(null); // Resetowanie prostokąta
    setLabelInput(""); // Czyszczenie pola tekstowego
  };

  return (
    <div>
      {/* Pole do ładowania obrazu */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Stały kontener 300x300 do wyświetlania zdjęcia i rysowania */}
      <div
        ref={canvasRef}
        style={{
          position: "relative",
          width: "300px", // Stała szerokość
          height: "300px", // Stała wysokość
          border: "1px solid black",
          cursor: "crosshair",
          backgroundImage: image ? `url(${image})` : "none",
          backgroundSize: "cover", // Dopasowanie obrazu do rozmiaru prostokąta
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {/* Rysowany prostokąt */}
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
            {/* Dynamicznie wyświetlany tekst */}
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

      {/* Formularz do wpisania nazwy prostokąta */}
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

      {/* Wyświetlenie współrzędnych */}
      {rectangle && (
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Pozycja początkowa:</strong> x: {startPos.x}, y:{" "}
            {startPos.y}
          </p>
          <p>
            <strong>Pozycja końcowa:</strong> x: {endPos.x}, y: {endPos.y}
          </p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
