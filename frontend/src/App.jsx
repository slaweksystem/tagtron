import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import Menu from "./Menu";
import Content from "./Content";
import Header from "./Header";

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("login"); // Domyślny ekran to logowanie
  const [loggedInUser, setLoggedInUser] = useState(null); // Stan użytkownika
  const [isRegistering, setIsRegistering] = useState(false); // Stan rejestracji
  const [selectedProject, setSelectedProject] = useState(null); // Wybrany projekt

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setCurrentScreen("projects"); // Po zalogowaniu przejdź do listy projektów
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentScreen("login"); // Po wylogowaniu przejdź do ekranu logowania
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      {loggedInUser ? (
        <>
          <Menu
            setCurrentScreen={setCurrentScreen}
            handleLogout={handleLogout}
            setSelectedProject={setSelectedProject}
          />
          <main style={{ flex: 1, padding: "20px" }}>
            <Header loggedInUser={loggedInUser} />
            <Content
              currentScreen={currentScreen}
              loggedInUser={loggedInUser}
              selectedProject={selectedProject}
              setSelectedProject={setSelectedProject}
            />
          </main>
        </>
      ) : (
        <main
          style={{
            flex: 1,
            padding: "20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isRegistering ? (
            <Register
              setIsRegistering={setIsRegistering}
              handleLogin={handleLogin}
            />
          ) : (
            <Login
              handleLogin={handleLogin}
              setIsRegistering={setIsRegistering}
            />
          )}
        </main>
      )}
    </div>
  );
};

export default App;
