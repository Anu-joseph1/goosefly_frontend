import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCog } from "react-icons/fa"; // Import icons
import "./OrganizationTopBar.css"; // Create a new CSS file for styling

const OrganizationTopBar = () => {
  const navigate = useNavigate(); // For back navigation

  return (
    <div className="organization-topbar">
      <FaArrowLeft className="icon" onClick={() => navigate(-1)} />
      <h2 className="title">COMPANY PROFILE</h2>
      <FaCog className="icon" />
    </div>
  );
};

export default OrganizationTopBar; // Ensure this is a default export








