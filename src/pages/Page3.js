import React from "react";
import "./Page3.css";
import profileImage from "../assets/goose.jpeg"; // Company profile image
import employeeImage1 from "../assets/profile2.jpg"; // Employee images
import employeeImage2 from "../assets/profile3.jpg";
import OrganizationTopBar from "../components/OrganizationTopBar"; // Import the OrganizationTopBar

const OrganizationPage = () => {
  return (
    <div>
      <OrganizationTopBar /> {/* Only OrganizationTopBar is shown here */}
      <div className="container">
        {/* Organization Info */}
        <div className="organization-info">
          <img src={profileImage} alt="Company Profile" className="profile-image" />
          <h3 className="company-name">GOOSEFLY</h3>
          <p className="bio">Bio</p>
          <p className="location">MH, India</p>
          <p className="employee-info">
            <strong>24 Employees</strong> · <strong>5 Expert connections</strong>
          </p>
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
          <div className="more-section">
            <p className="more">18 more...</p>
            <button className="add-more-btn">Add more</button>
          </div>
        </div>

        {/* Engineering Experts */}
        <h4 className="section-title">Engineering Experts</h4>
        <div className="section">
          {[employeeImage1, employeeImage2, employeeImage1, employeeImage2].map((image, index) => (
            <div key={index} className="employee">
              <img src={image} alt="Expert Profile" className="employee-image" />
              <div>
                <p className="employee-name">Yuri Dud</p>
                <p className="employee-role">Plant Engineer</p>
              </div>
            </div>
          ))}
          <div className="more-section">
            <p className="more">2 more...</p>
            <button className="add-more-btn">Add more</button>
          </div>
        </div>

        {/* Add More Experts Button */}
        {/* <button className="add-experts-btn">Add More Experts</button> */}
      </div>
    </div>
  );
};

export default OrganizationPage;