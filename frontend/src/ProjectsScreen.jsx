import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";
import AddGroupModal from "./AddGroupModal";

const ProjectsScreen = ({ selectedProject, setSelectedProject }) => {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Paginacja
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Liczba projektów na stronie

  // Pobieranie danych projektów z API
  const fetchProjects = async (page = 1) => {
    const offset = 0; //offset w query
    const limit = itemsPerPage + 10; //limit w query

    try {
      const response = await fetch(
        `http://localhost:8000/projects/?offset=${offset}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Nie udało się pobrać projektów");
      }
      const data = await response.json();
      setProjects(data); // Przechowywanie pobranych danych projektów
    } catch (error) {
      console.error("Błąd podczas pobierania projektów:", error);
    }
  };

  // Fetch projects initially when the component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleAddGroup = async () => {
    fetchProjects(); // Re-fetch projects after adding
  };

  // Filtrowanie projektów według wyszukiwania
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Logika paginacji
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Zmienianie strony
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Obliczanie liczby stron
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProjects.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (selectedProject) {
    return (
      <div>
        <h2 style={{ textAlign: "center" }}>{selectedProject.title}</h2>
        <Canvas
          projectDescription={selectedProject.description}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
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
        {currentProjects.map((project) => (
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

      {/* Paginacja */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <ul
          style={{ listStyleType: "none", padding: 0, display: "inline-flex" }}
        >
          {pageNumbers.map((number) => (
            <li key={number} style={{ margin: "0 5px" }}>
              <button
                onClick={() => paginate(number)}
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
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AddGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddGroup={handleAddGroup} // Pass handleAddGroup to refresh project list
      />
    </div>
  );
};

export default ProjectsScreen;
