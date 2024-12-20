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
          setCurrentScreen("projects");
          setSelectedProject(null);
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
        onClick={() => setCurrentScreen("account")}
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
        onClick={handleLogout}
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
