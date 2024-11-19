// src/components/Login.jsx
import { useState } from "react";

function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginChange = (e) => setLogin(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", login);
    console.log("Password:", password);
  };

  return (
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
        <label>Hasło: </label>
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Wpisz hasło"
        />
      </div>
      <button type="submit">Zaloguj się</button>
    </form>
  );
}

export default Login;
