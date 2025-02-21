import React, { useState } from "react";

const Register = ({ setIsRegistering }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    let errors = {};
    if (!email) errors.email = "Email jest wymagany.";
    else if (!validateEmail(email))
      errors.email = "Podaj poprawny adres e-mail.";

    if (!firstName) errors.firstName = "Imię jest wymagane.";
    if (!lastName) errors.lastName = "Nazwisko jest wymagane.";
    if (!username) errors.username = "Nazwa użytkownika jest wymagana.";
    if (!password) errors.password = "Hasło jest wymagane.";

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) return;

    try {
      const response = await fetch("http://localhost:8000/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setError(null);
        console.log("Użytkownik zarejestrował się pomyślnie");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Registration failed");
      }
    } catch (err) {
      setError("Coś poszło nie tak. Spróbuj ponownie.");
      console.error(err);
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
            border: fieldErrors.email ? "1px solid red" : "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        {fieldErrors.email && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {fieldErrors.email}
          </span>
        )}

        <input
          type="text"
          placeholder="Wpisz imię"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: fieldErrors.firstName ? "1px solid red" : "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        {fieldErrors.firstName && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {fieldErrors.firstName}
          </span>
        )}

        <input
          type="text"
          placeholder="Wpisz nazwisko"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: fieldErrors.lastName ? "1px solid red" : "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        {fieldErrors.lastName && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {fieldErrors.lastName}
          </span>
        )}

        <input
          type="text"
          placeholder="Wpisz nazwę użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: fieldErrors.username ? "1px solid red" : "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        {fieldErrors.username && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {fieldErrors.username}
          </span>
        )}

        <input
          type="password"
          placeholder="Wpisz hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            border: fieldErrors.password ? "1px solid red" : "1px solid #ddd",
            borderRadius: "5px",
          }}
        />
        {fieldErrors.password && (
          <span style={{ color: "red", fontSize: "12px" }}>
            {fieldErrors.password}
          </span>
        )}

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
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && (
          <p style={{ color: "green" }}>Rejestracja zakończona sukcesem!</p>
        )}
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
