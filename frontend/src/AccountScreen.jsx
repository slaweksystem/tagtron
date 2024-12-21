import React from "react";

const AccountScreen = ({ loggedInUser }) => {
  return (
    <div>
      <p>Dane konta użytkownika:</p>
      <ul>
        <li>Login: {loggedInUser}</li>
        <li>Data zalogowania: {new Date().toLocaleString()}</li>
      </ul>
      <button
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
    </div>
  );
};

export default AccountScreen;