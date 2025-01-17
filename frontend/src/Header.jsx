import React from "react";

const Header = ({ loggedInUser }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ flex: 1 }}></div>

      <img
        src="slonce.jpg" // Ścieżka do pliku slonce.jpg
        alt="Logo"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
        }}
      />

      <span
        style={{
          flex: 1,
          textAlign: "right",
          fontSize: "14px",
          color: "#555",
        }}
      >
        Zalogowany jako: {loggedInUser}
      </span>
    </header>
  );
};

export default Header;
