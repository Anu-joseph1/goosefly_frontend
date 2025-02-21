import React from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import profilePic from "../assets/profile.jpg"; // Profile picture
import postImage from "../assets/post.jpg"; // Post image
import { FaGlobeAmericas, FaThumbsUp, FaComment, FaShare } from "react-icons/fa"; // Icons

const Page1 = () => {
  const navigate = useNavigate(); // Hook for navigation

  const goToProfile = () => {
    navigate("/page4"); // Navigate to Page4
  };

  return (
    <div className="page1-container">
      {/* Profile Section (Cover photo removed) */}
      <div className="profile-container">
        <img src={profilePic} alt="Profile" className="profile-pic" />
        <div className="profile-info">
          <h2 className="name" onClick={goToProfile}>John Doe</h2>
          <p className="designation">Software Engineer</p>
          <div className="post-details">
            <span className="post-time">2 hours ago</span>
            <FaGlobeAmericas className="globe-icon" />
          </div>
        </div>
      </div>

      {/* Your Activity Section */}
      <div className="activity-container">
        <h3 className="activity-title">Your Activity</h3>
        <div className="activity-image">
          <img src={postImage} alt="Post" />
        </div>
        <textarea
          className="caption-box"
          placeholder="Robotics is the interdisciplinary study and practice of the design, construction, operation, and use of robots"
        ></textarea>

        {/* Reaction Section */}
        <div className="reaction-container">
          <div className="reaction-item">
            <span className="reaction-count">7 Upvotes</span>
            <FaThumbsUp className="reaction-icon" />
            <span className="reaction-text">Upvote</span>
          </div>
          <div className="reaction-item">
            <FaComment className="reaction-icon" />
            <span className="reaction-text">Comment</span>
          </div>
          <div className="reaction-item">
            <span className="reaction-count">11 Shares</span>
            <FaShare className="reaction-icon" />
            <span className="reaction-text">Share</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page1;
