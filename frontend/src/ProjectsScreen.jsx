import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";
import AddGroupModal from "./AddGroupModal";

const ProjectsScreen = ({ selectedProject, setSelectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pobieranie danych projektów z API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/projects/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data); // Przechowywanie pełnych danych projektów
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleAddGroup = async () => {
    // Funkcjonalność dodawania grupy
  };

  // Filtrowanie projektów według wyszukiwania
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedProject) {
    return (
      <div>
        <h2 style={{ textAlign: "center" }}>{selectedProject.title}</h2>
        <Canvas
          projectDescription={selectedProject.description}
          projectId={selectedProject.id}
        />
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
            onClick={() => handleProjectSelect(project)}
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
            {project.title}
          </button>
        ))}
      </div>

      <AddGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGroup={handleAddGroup}
      />
    </div>
  );
};

export default ProjectsScreen;
