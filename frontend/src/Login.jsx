import React, { useState } from "react";

const Login = ({ handleLogin, setIsRegistering }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Nowe pole na hasło

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      handleLogin(username); // Zaloguj użytkownika
    }
  };

  return (
    <div>
      <h2>Zaloguj się</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
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
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Zaloguj
        </button>
      </form>
      <p>
        Nie masz konta?{" "}
        <button
          onClick={() => setIsRegistering(true)}
          style={{
            color: "#007bff",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          Zarejestruj się
        </button>
      </p>
    </div>
  );
};

export default Login;
