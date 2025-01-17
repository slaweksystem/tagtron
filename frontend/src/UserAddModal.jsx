import React, { useState } from "react";

const UserAddModal = ({ projectTitle, onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("User"); // Domyślna rola

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async () => {
    if (!email) {
      alert("Proszę podać adres e-mail użytkownika.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Proszę podać poprawny adres e-mail.");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");
      if (!token)
        throw new Error("Brak tokena autoryzacyjnego. Zaloguj się ponownie.");
      console.log("Odpowiedź serwera:", projectTitle, email, role);
      const response = await fetch(
        `http://localhost:8000/projects/users/email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_title: projectTitle,
            user_email: email,
            role: role,
          }),
        }
      );

      if (!response.ok) {
        let errorDetail = "Nie udało się dodać użytkownika.";
        try {
          const errorData = await response.json();
          errorDetail = errorData.detail || errorDetail;
          console.error("Błąd odpowiedzi serwera:", errorData); // Logowanie szczegółów błędu
        } catch (error) {
          console.error("Nie udało się przetworzyć odpowiedzi serwera:", error);
        }
        throw new Error(errorDetail);
      }

      const result = await response.json();
      alert(result.message || "Użytkownik został dodany.");
      setEmail(""); // Wyczyść pole
    } catch (error) {
      alert(error.message || "Wystąpił błąd podczas dodawania użytkownika.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: "8px",
          padding: "20px",
          width: "400px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3>Dodaj użytkownika</h3>
        <input
          type="email"
          placeholder="Wpisz e-mail użytkownika"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="User">User</option>
          <option value="Modder">Modder</option>
          <option value="Admin">Admin</option>
        </select>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <button
            onClick={handleAddUser}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Dodaj użytkownika
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAddModal;
