import React, { useState } from "react";

const AddGroupModal = ({ isOpen, onClose, onAddGroup }) => {
  const [newGroupName, setNewGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const handleAddGroup = async () => {
    if (newGroupName.trim() && groupDescription.trim()) {
      try {
        // Wywołanie API do dodania projektu
        const response = await fetch("http://localhost:8000/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Token autoryzacyjny
          },
          body: JSON.stringify({
            title: newGroupName.trim(),
            description: groupDescription.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add project");
        }

        const newProject = await response.json();

        // Aktualizacja lokalnego stanu (jeśli konieczne)
        onAddGroup(newProject); // Przekazanie danych nowego projektu do rodzica
        setNewGroupName(""); // Resetuj pole tekstowe
        setGroupDescription(""); // Resetuj pole opisu
        onClose(); // Zamknij okno
      } catch (error) {
        console.error("Error adding project:", error);
        alert("Error adding project. Please try again.");
      }
    } else {
      alert("Both fields are required.");
    }
  };

  if (!isOpen) return null; // Jeśli okno jest zamknięte, nic nie renderuj

  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "300px",
        }}
      >
        <h3>Dodaj nową grupę</h3>
        <input
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Nazwa grupy"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <textarea
          value={groupDescription}
          onChange={(e) => setGroupDescription(e.target.value)}
          placeholder="Opis grupy"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            margin: "10px 0",
            borderRadius: "5px",
            border: "1px solid #ccc",
            resize: "none",
          }}
          rows="3"
        ></textarea>
        <div>
          <button
            onClick={handleAddGroup}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginRight: "10px",
              cursor: "pointer",
            }}
          >
            Dodaj
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGroupModal;
