import React, { useState, useEffect, useRef } from "react";
import ImageUploadModal from "./ImageUploadModal"; // Importujemy komponent ImageUploadModal
import UserAddModal from "./UserAddModal";

const Canvas = ({ projectDescription, projectId, projectTitle }) => {
  const [images, setImages] = useState([]); // Lista obrazów
  const [currentImageIndex, setCurrentImageIndex] = useState(-1); // Indeks aktualnie wyświetlanego obrazu
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
  const [labels, setLabels] = useState([]); // Lista etykiet
  const [role, setRole] = useState([]);
  const canvasRef = useRef(null);

  // Załaduj użytkowników i obrazy po załadowaniu komponentu
  useEffect(() => {
    handleGetUsers();
    handleGetImages();
  }, []);

  // Pobieranie etykiet
  const fetchLabels = async (imageId) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }
      const response = await fetch(
        `http://localhost:8000/images/labels/${imageId}`,
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
      if (data && Array.isArray(data)) {
        setLabels(data); // Aktualizacja stanu etykiet
      } else {
        console.warn("Otrzymano niepoprawne dane dla etykiet.");
        setLabels([]); // Jeśli dane są nieprawidłowe, czyścimy etykiety
      }
    } catch (error) {
      console.error("Błąd podczas pobierania etykiet:", error);
      setLabels([]); // Jeśli błąd, czyścimy etykiety
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

      if (data && Array.isArray(data) && data.length > 0) {
        setImages(data);
        loadImage(data[0].id); // Załaduj pierwszy obraz
        setCurrentImageIndex(0);
        fetchLabels(data[0].id);
      } else {
        throw new Error("Brak dostępnych obrazów.");
      }
    } catch (error) {
      setCurrentImageIndex(-1);
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

  // Ładowanie obrazu bez labeli
  const loadUnlabelImage = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/images/unlabeled-image/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 404) {
        // Obsługuje brak treści w odpowiedzi, ale uznaje to za sukces
        alert("Brak zdjęc bez labelów.");
        return;
      } else {
        if (!response.ok) {
          throw new Error(`Błąd: ${response.status}`);
        }

        const data = await response.json();
        for (let i = 0; i < images.length; i++) {
          if (images[i].id == data.image_id) {
            setCurrentImageIndex(i);
            loadImage(images[i].id);
            fetchLabels(images[i].id);
            break;
          }
        }
      }
    } catch (error) {
      console.error(error);
      alert("Błąd funkcji.");
    }
  };

  // Obsługa rysowania prostokątków
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setStartPos({ x, y });
    setDrawing(true);
  };

  const handleMouseUp = (e) => {
    if (!drawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setEndPos({ x, y });

    setRectangle({
      x: Math.min(startPos.x, x),
      y: Math.min(startPos.y, y),
      width: Math.abs(x - startPos.x),
      height: Math.abs(y - startPos.y),
    });

    setDrawing(false);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

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
      fetchLabels(images[currentImageIndex].id);
      alert("Etykieta zapisana pomyślnie!");
    } catch (error) {
      console.error("Błąd podczas zapisywania etykiety:", error);
      alert("Wystąpił błąd podczas zapisywania etykiety.");
    }
  };

  //usuwanie labeli
  const deleteLabel = async (imageId, labelId) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/images/labels/${imageId}/${labelId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Błąd usuwania etykiety");
      }

      console.log("Etykieta usunięta pomyślnie");
      fetchLabels(images[currentImageIndex].id);

      setRectangle(null); // Usuwamy prostokąt
      setLabel(null); // Usuwamy etykietę
      setLabelInput(""); // Wyczyść pole tekstowe
    } catch (error) {
      console.error("Błąd podczas usuwania etykiety:", error);
      alert("Wystąpił błąd podczas usuwania etykiety.");
    }
  };

  //usuwanie uzytkownikow
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }
      const response = await fetch(
        `http://localhost:8000/projects/users/delete_id/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Błąd usuwania uzytkownika");
      }

      console.log("Pomyslnie usunieto użytkownika");

      handleGetUsers();
    } catch (error) {
      console.error("Błąd podczas usuwania użytkownika:", error);
      alert("Wystąpił błąd podczas usuwania użytkownika.");
    }
  };

  // Funkcja do zmiany zdjęć
  const handleChangeImage = (direction) => {
    const newIndex = currentImageIndex + direction;

    // Sprawdzenie, czy nowy indeks jest w dozwolonym zakresie
    if (newIndex >= 0 && newIndex < images.length) {
      setCurrentImageIndex(newIndex); // Zmiana indeksu
      loadImage(images[newIndex].id); // Załaduj obraz na podstawie nowego indeksu
      fetchLabels(images[newIndex].id);
    }
  };

  // Sprawdzanie roli
  const checkRole = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(
        `http://localhost:8000/projects/check_role/${projectId}`,
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
      setRole(data.role);
    } catch (error) {
      console.error("Błąd podczas ładowania obrazu:", error);
      alert("Wystąpił błąd podczas ładowania obrazu.");
    }
  };

  // Wyświetlanie użytkowników projektu
  const renderUsers = () => (
    <div>
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span>
                {user.first_name} {user.last_name} ({user.email}) {user.role}
              </span>
              {(role === "Owner" || role === "Modder") && (
                <button
                  onClick={() => handleDeleteUser(user.project_user_id)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Usuń
                </button>
              )}
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
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
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
                      top: -20,
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
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>Brak obrazów w projekcie</p>
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
        <span style={{ margin: "0 10px" }}></span>
        <button
          onClick={() => loadUnlabelImage()}
          style={{
            padding: "5px 10px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Idź do bez labela
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
      {labels.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <h3>Etykiety dla aktualnego obrazu:</h3>
          <table
            style={{
              margin: "0 auto",
              borderCollapse: "collapse",
              width: "80%",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Etykieta
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>X1</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Y1</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>X2</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Y2</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label) => (
                <tr key={label.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {label.label}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {label.position_x1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {label.position_y1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {label.position_x2}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {label.position_y2}
                  </td>
                  <button
                    onClick={() =>
                      setRectangle(
                        {
                          x: label.position_x1,
                          y: label.position_y1,
                          width: label.position_x2 - label.position_x1,
                          height: label.position_y2 - label.position_y1,
                        },
                        setLabel(label.label),
                        setLabelInput(label.label)
                      )
                    }
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    rysuj
                  </button>
                  <button
                    onClick={() =>
                      deleteLabel(images[currentImageIndex].id, label.id)
                    }
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                    }}
                  >
                    usun
                  </button>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Canvas;
