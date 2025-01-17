import React, { useState } from "react";

const Login = ({ setIsRegistering, handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error on new attempt

    if (username && password) {
      try {
        const response = await fetch("http://localhost:8000/auth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: username,
            password: password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Token received:", data.access_token);
          // Save the token (for example, in localStorage)
          localStorage.setItem("access_token", data.access_token);
          // Optionally, redirect the user or update the state
          handleLogin(username);
        } else {
          // Handle login errors
          const errorData = await response.json();
          setError(errorData.detail || "Login failed");
        }
      } catch (err) {
        setError("Coś poszło nie tak. Spróbuj ponownie");
        console.error(err);
      }
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
          type="password"
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
        {error && <p style={{ color: "red" }}>{error}</p>}
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
