import React from "react";
import Canvas from "./Canvas";

const Content = ({
  currentScreen,
  loggedInUser,
  selectedProject,
  setSelectedProject,
}) => {
  const projects = [
    { id: 1, name: "Projekt Alpha" },
    { id: 2, name: "Projekt Beta" },
    { id: 3, name: "Projekt Gamma" },
    { id: 4, name: "Projekt Delta" },
  ];

  const handleProjectSelect = (projectName) => {
    setSelectedProject(projectName); // Ustaw wybraną nazwę projektu
  };

  switch (currentScreen) {
    case "projects":
      if (selectedProject) {
        return (
          <div>
            <h2 style={{ textAlign: "center" }}>{selectedProject}</h2>
            <Canvas />
          </div>
        );
      }
      return (
        <div>
          <p>Lista projektów</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectSelect(project.name)}
                style={{
                  padding: "40px",
                  fontSize: "16px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {project.name}
              </button>
            ))}
          </div>
        </div>
      );
    case "account":
      return (
        <div>
          <p>Dane konta użytkownika:</p>
          <ul>
            <li>Login: {loggedInUser}</li>
            <li>Data zalogowania: {new Date().toLocaleString()}</li>
          </ul>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Zmień hasło
          </button>
        </div>
      );
    case "logout":
      return <p>Wylogowano</p>;
    default:
      return <p>Wybierz opcję z menu</p>;
  }
};

export default Content;
