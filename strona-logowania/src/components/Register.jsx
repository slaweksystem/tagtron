import { useState } from "react";

function Register() {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginChange = (e) => setLogin(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { login, email, password };
    localStorage.setItem("user", JSON.stringify(userData));
    alert("Rejestracja zakończona sukcesem!");
  };

  return (
    <div className="register-page">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login: </label>
          <input
            type="text"
            value={login}
            onChange={handleLoginChange}
            placeholder="Wpisz login"
          />
        </div>
        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Wpisz email"
          />
        </div>
        <div>
          <label>Hasło: </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Wpisz hasło"
          />
        </div>
        <button type="submit" className="register-button">Zarejestruj się</button>
      </form>
    </div>
  );
}

export default Register;
