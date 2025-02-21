import React from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import profilePic1 from "../assets/profile.jpg";  // Profile picture 1
import profilePic2 from "../assets/profile2.jpg";  // Profile picture 2
import profilePic3 from "../assets/profile3.jpg";  // Profile picture 3
import postImage1 from "../assets/post.jpg"; // Post image 1
import postImage2 from "../assets/post2.jpg"; // Post image 2
import postImage3 from "../assets/post3.jpg"; // Post image 3
import { FaGlobeAmericas, FaThumbsUp, FaComment, FaShare } from "react-icons/fa"; // Icons

const employees = [
  {
    id: 1,
    name: "John Doe",
    designation: "Software Engineer",
    postTime: "2 hours ago",
    profilePic: profilePic1,
    postImage: postImage1,
    caption: "Robotics is the interdisciplinary study and practice of the design, construction, operation, and use of robots.",
    upvotes: 7,
    shares: 11,
  },
  {
    id: 2,
    name: "Emily Smith",
    designation: "Data Scientist",
    postTime: "3 hours ago",
    profilePic: profilePic2,
    postImage: postImage2,
    caption: "AI is transforming the way businesses analyze data and make decisions.",
    upvotes: 12,
    shares: 18,
  },
  {
    id: 3,
    name: "Michael Johnson",
    designation: "Product Manager",
    postTime: "5 hours ago",
    profilePic: profilePic3,
    postImage: postImage3,
    caption: "User experience plays a vital role in product development.",
    upvotes: 9,
    shares: 15,
  },
];

const Page1 = () => {
  const navigate = useNavigate(); // Hook for navigation

  const goToProfile = () => {
    navigate("/profile"); // Navigate to Profile Page
  };

  return (
    <div className="page1-container">
      {employees.map((employee) => (
        <div key={employee.id} className="employee-post">
          {/* Profile Section */}
          <div className="profile-container">
            <img src={employee.profilePic} alt="Profile" className="profile-pic" />
            <div className="profile-info">
              <h2 className="name" onClick={goToProfile}>{employee.name}</h2>
              <p className="designation">{employee.designation}</p>
              <div className="post-details">
                <span className="post-time">{employee.postTime}</span>
                <FaGlobeAmericas className="globe-icon" />
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="activity-container">
            <h3 className="activity-title">Your Activity</h3>
            <div className="activity-image">
              <img src={employee.postImage} alt="Post" />
            </div>
            <textarea className="caption-box" placeholder={employee.caption} readOnly></textarea>

            {/* Reaction Section */}
            <div className="reaction-container">
              <div className="reaction-item">
                <span className="reaction-count">{employee.upvotes} Upvotes</span>
                <FaThumbsUp className="reaction-icon" />
                <span className="reaction-text">Upvote</span>
              </div>
              <div className="reaction-item">
                <FaComment className="reaction-icon" />
                <span className="reaction-text">Comment</span>
              </div>
              <div className="reaction-item">
                <span className="reaction-count">{employee.shares} Shares</span>
                <FaShare className="reaction-icon" />
                <span className="reaction-text">Share</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Page1;
