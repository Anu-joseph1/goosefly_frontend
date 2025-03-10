import React from "react";
import { FaGlobeAmericas } from "react-icons/fa";

const ProfileSection = ({ profilePic, name, designation, postTime, goToProfile }) => {
  return (
    <div className="profile-container">
      <img src={profilePic} alt="Profile" className="profile-pic" />
      <div className="profile-info">
        <h2 className="name" onClick={goToProfile}>{name}</h2> {/* Call goToProfile on click */}
        <p className="designation">{designation}</p>
        <div className="post-details">
          <span className="post-time">{postTime}</span>
          <FaGlobeAmericas className="globe-icon" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;