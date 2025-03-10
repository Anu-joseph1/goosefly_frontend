import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeePost from "../components/EmployeePost"; // Import EmployeePost component
import { employees } from "../data/employees"; // Import employees data
import { FaArrowLeft } from "react-icons/fa"; // Import left arrow icon
import "./page4.css"; // Import the CSS file

const Page4 = () => {
  const { employeeId } = useParams(); // Get the employeeId from the URL
  const navigate = useNavigate(); // For navigation
  const [employeePosts, setEmployeePosts] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(() => {
    // Find the selected employee and their posts
    const selectedEmployee = employees.find((emp) => emp.id === parseInt(employeeId));
    if (selectedEmployee) {
      setEmployeeDetails(selectedEmployee);
      const filteredPosts = employees.filter((emp) => emp.id === parseInt(employeeId));
      setEmployeePosts(filteredPosts);
    }
  }, [employeeId]);

  if (!employeeDetails) {
    return <div>Employee not found.</div>;
  }

  return (
    <div className="page4-container">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-header">
          <FaArrowLeft className="back-arrow" onClick={() => navigate(-1)} /> {/* Left arrow for navigation */}
          <div className="profile-info">
            <img src={employeeDetails.profilePic} alt="Profile" className="profile-pic" />
            <div className="profile-details">
              <h2 className="profile-name">{employeeDetails.name}</h2>
              <p className="profile-designation">{employeeDetails.designation}</p>
              <p className="profile-username">@{employeeDetails.username}</p>
            </div>
          </div>
        </div>
        <p className="profile-bio">{employeeDetails.bio}</p>
        <div className="profile-stats">
          <button className="edit-profile-btn">Edit Profile</button>
          <div className="stats">
            <span className="followers">{employeeDetails.followers} Followers</span>
            <span className="experts">{employeeDetails.experts} Experts</span>
          </div>
        </div>
      </div>

      {/* Employee Posts */}
      {employeePosts.map((post) => (
        <EmployeePost key={post.id} employee={post} goToProfile={() => {}} />
      ))}
    </div>
  );
};

export default Page4;