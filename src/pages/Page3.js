import React from "react";
import "./Page3.css";
import profileImage from "../assets/goose.jpeg"; // Company profile image
import employeeImage1 from "../assets/profile2.jpg"; // Employee images
import employeeImage2 from "../assets/profile3.jpg";

const OrganizationPage = () => {
  return (
    <div className="container">
      {/* Header */}
      {/* <h3>ORGANIZATION PROFILE</h3> */}

      {/* Organization Info */}
      <div className="organization-info">
        {/* Profile Image */}
        <img src={profileImage} alt="Company Profile" className="profile-image" />

        {/* Organization Details */}
        <h3 className="company-name">GOOSEFLY</h3>
        <p className="bio">Bio</p>
        <p className="location">MH, India</p>
        <p className="employee-info">25 Employees · 5 Expert connections</p>
      </div>

      {/* Employees - Engineering */}
      <h4 className="section-title">Employees - Engineering</h4>
      <div className="section">
        {[employeeImage1, employeeImage2, employeeImage1, employeeImage2].map((image, index) => (
          <div key={index} className="employee">
            <img src={image} alt="Employee Profile" className="employee-image" />
            <div>
              <p className="employee-name">Yuri Dud</p>
              <p className="employee-role">Plant Engineer</p>
            </div>
          </div>
        ))}
        <p className="more">18 more...</p>
      </div>

      {/* Engineering Experts */}
      <h4 className="section-title">Engineering Experts</h4>
      <div className="section">
        {[employeeImage1, employeeImage2].map((image, index) => (
          <div key={index} className="employee">
            <img src={image} alt="Expert Profile" className="employee-image" />
            <div>
              <p className="employee-name">Yuri Dud</p>
              <p className="employee-role">Plant Engineer</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganizationPage;
