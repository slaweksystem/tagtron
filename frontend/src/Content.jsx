import React from "react";
import ProjectsScreen from "./ProjectsScreen";
import AccountScreen from "./AccountScreen";
import AdminPanel from "./AdminPanel";

const Content = ({
  currentScreen,
  loggedInUser,
  selectedProject,
  setSelectedProject,
}) => {
  switch (currentScreen) {
    case "projects":
      return (
        <ProjectsScreen
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />
      );
    case "account":
      return <AccountScreen loggedInUser={loggedInUser} />;
    case "logout":
      return <p>Wylogowano</p>;
    case "AdminPanel":
      return <AdminPanel />;
    default:
      return <p>Wybierz opcję z menu</p>;
  }
};

export default Content;
