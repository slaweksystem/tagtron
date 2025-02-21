import React, { useState, useEffect } from "react";
import ChangePasswordModalAdmin from "./ChangePasswordModalAdmin";
const AdminPanel = () => {
  const [usersall, setUsersAll] = useState([]); // Lista użytkowników projektu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUserName] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  // Załaduj użytkowników po załadowaniu komponentu
  useEffect(() => {
    handleGetUsers();
  }, []);

  // Pobieranie użytkowników projektu
  const handleGetUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      }

      const response = await fetch(`http://localhost:8000/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status}`);
      }

      const data = await response.json();
      setUsersAll(data);
      console.log(data[1]);
    } catch (error) {
      console.error("Błąd podczas pobierania użytkowników:", error);
      setError("Wystąpił błąd podczas pobierania użytkowników.");
    }
  };

  // Wyświetlanie użytkowników projektu
  const renderUsers = () => (
    <div>
      {usersall.length > 0 ? (
        <ul>
          {usersall.map((userall) => (
            <li
              key={userall.id}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <span>
                {userall.first_name} {userall.last_name} ({userall.email}){" "}
                {userall.username}
              </span>
              {
                <button
                  onClick={() => {
                    openModal();
                    setUserName(userall.username);
                  }}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Zmień Hasło
                </button>
              }
              {/* Modal do zmiany hasła */}
              {isModalOpen && (
                <ChangePasswordModalAdmin
                  onClose={closeModal}
                  username1={username}
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Brak dostepu.</p>
      )}
    </div>
  );

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Użytkownicy:</h3>

      {renderUsers()}
    </div>
  );
};

export default AdminPanel;
