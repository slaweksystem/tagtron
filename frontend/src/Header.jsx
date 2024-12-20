import React from "react";

const Header = ({ loggedInUser }) => {
  return (
    <header
      style={{
        textAlign: "right",
        padding: "10px 20px",
        backgroundColor: "#f8f9fa",
        borderBottom: "1px solid #ddd",
      }}
    >
      <span style={{ fontSize: "14px", color: "#555" }}>
        Zalogowany jako: {loggedInUser}
      </span>
    </header>
  );
};

export default Header;
