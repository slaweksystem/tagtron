import React, { useEffect, useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";

const AccountScreen = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funkcja do otwierania i zamykania modala
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Pobierz dane użytkownika z endpointu
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error("Nie udało się pobrać danych użytkownika");
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
      }
    };

    fetchUserData();
  }, []);

  // Jeśli dane użytkownika nie zostały jeszcze załadowane
  if (!userData) {
    return <p>Ładowanie danych użytkownika...</p>;
  }

  return (
    <div>
      <p>Dane konta użytkownika:</p>
      <ul>
        <li>Email: {userData.email}</li>
        <li>Username: {userData.username}</li>
      </ul>
      <button
        onClick={openModal}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Zmień hasło
      </button>

      {/* Modal do zmiany hasła */}
      {isModalOpen && <ChangePasswordModal onClose={closeModal} />}
    </div>
  );
};

export default AccountScreen;
