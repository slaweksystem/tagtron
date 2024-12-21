import React from "react";
import Canvas from "./Canvas";

const ProjectsScreen = ({ selectedProject, setSelectedProject }) => {
  const projects = [
    { id: 1, name: "Projekt Alpha" },
    { id: 2, name: "Projekt Beta" },
    { id: 3, name: "Projekt Gamma" },
    { id: 4, name: "Projekt Delta" },
  ];

  const handleProjectSelect = (projectName) => {
    setSelectedProject(projectName);
  };

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
};

export default ProjectsScreen;
