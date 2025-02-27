import React, { useState } from "react";

const ChangePasswordModal = ({ onClose }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/auth/", {
        // Poprawiony endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: loggedInUser, password: password }),
      });

      if (response.ok) {
        alert("Hasło zostało zmienione.");
        onClose();
      } else {
        const errorData = await response.json();

        // Obsługa błędu zgodnie ze specyfikacją (422)
        if (response.status === 422 && errorData.detail) {
          const errorMsg = errorData.detail
            .map((err) => `${err.loc.join(" -> ")}: ${err.msg}`)
            .join("\n");
          alert(`Błąd walidacji:\n${errorMsg}`);
        } else {
          alert(
            `Błąd: ${errorData.message || "Błędne hasło, Spróbuj ponownie."}`
          );
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Wystąpił błąd podczas zmiany hasła.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <h2>Zmień hasło</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Nowe hasło:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginLeft: "10px", padding: "5px", width: "90%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}></div>
        <button
          type="submit"
          onClick={onClose}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Zatwierdź
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Anuluj
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordModal;
