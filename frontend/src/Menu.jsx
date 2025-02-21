import React from "react";

const Menu = ({ setCurrentScreen, handleLogout, setSelectedProject }) => {
  return (
    <aside
      style={{
        width: "200px",
        backgroundColor: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "20px",
        borderRight: "1px solid #ddd",
      }}
    >
      <button
        onClick={() => {
          setCurrentScreen("projects"); // Ustawienie ekranu na projekty
          setSelectedProject(null); // Resetowanie wybranego projektu
        }}
        style={{
          padding: "15px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Lista projektów
      </button>
      <button
        onClick={() => setCurrentScreen("account")} // Ustawienie ekranu na konto
        style={{
          padding: "15px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Dane konta
      </button>
      <button
        onClick={() => {
          setCurrentScreen("AdminPanel"); // Ustawienie ekranu na projekty
          setSelectedProject(null); // Resetowanie wybranego projektu
        }}
        style={{
          padding: "15px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Admin Panel
      </button>
      <button
        onClick={handleLogout} // Obsługa wylogowania
        style={{
          padding: "15px",
          fontSize: "16px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Wyloguj
      </button>
    </aside>
  );
};

export default Menu;
