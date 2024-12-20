import React, { useState } from "react";

const Register = ({ setIsRegistering, handleLogin }) => {
  const [email, setEmail] = useState(""); // Nowe pole na email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Nowe pole na hasło
  const [emailError, setEmailError] = useState(""); // Stan na błędy e-maila

  // Funkcja walidująca e-mail
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Podaj poprawny adres e-mail.");
      return;
    } else {
      setEmailError(""); // Resetujemy błąd
    }

    if (email && username && password) {
      handleLogin(username); // Po rejestracji logujemy użytkownika
    }
  };

  return (
    <div>
      <h2>Rejestracja</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          placeholder="Wpisz email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: emailError ? "1px solid red" : "1px solid #ddd", // Kolor ramki w przypadku błędu
            borderRadius: "5px",
          }}
        />
        {emailError && (
          <span style={{ color: "red", fontSize: "12px" }}>{emailError}</span>
        )}{" "}
        {/* Wyświetlamy błąd */}
        <input
          type="text"
          placeholder="Wpisz nazwę użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        <input
          type="password" // Typ zmieniony na 'password'
          placeholder="Wpisz hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Zarejestruj
        </button>
      </form>
      <p>
        Masz już konto?{" "}
        <button
          onClick={() => setIsRegistering(false)}
          style={{
            color: "#007bff",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Zaloguj się
        </button>
      </p>
    </div>
  );
};

export default Register;
