import React, { useState } from "react";
import Canvas from "./Canvas";
import AddGroupModal from "./AddGroupModal";

const ProjectsScreen = ({ selectedProject, setSelectedProject }) => {
  const [projects, setProjects] = useState([
    { id: 1, name: "Projekt Alpha" },
    { id: 2, name: "Projekt Beta" },
    { id: 3, name: "Projekt Gamma" },
    { id: 4, name: "Projekt Delta" },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Nowy stan do przechowywania zapytania wyszukiwania

  const handleProjectSelect = (projectName) => {
    setSelectedProject(projectName);
  };

  const handleAddGroup = (groupName) => {
    setProjects((prevProjects) => [
      ...prevProjects,
      { id: prevProjects.length + 1, name: groupName },
    ]);
  };

  // Filtrowanie projektów na podstawie zapytania
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Sekcja przycisków na górze */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Dodaj grupę
        </button>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: "0",
            textAlign: "center",
            flex: "1",
          }}
        >
          Lista projektów
        </p>
      </div>

      {/* Pole wyszukiwania */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Szukaj grupy..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "50%",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Lista projektów */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {filteredProjects.map((project) => (
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

      {/* Modal do dodawania grupy */}
      <AddGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGroup={handleAddGroup}
      />
    </div>
  );
};

export default ProjectsScreen;
