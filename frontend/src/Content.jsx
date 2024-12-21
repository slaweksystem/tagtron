import React from "react";
import ProjectsScreen from "./ProjectsScreen";
import AccountScreen from "./AccountScreen";

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
    default:
      return <p>Wybierz opcję z menu</p>;
  }
};

export default Content;
