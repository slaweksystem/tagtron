import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <div className="app-container">
      <Header />
      <nav>
        <Link to="/login">Logowanie</Link>
        {" | "}
        <Link to="/register">Rejestracja</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
