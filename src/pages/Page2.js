import React from "react";
import "./page2.css";
import ReportTopBar from "../components/ReportTopBar"; 

// Import user images
import user1Image from "../assets/profile.jpg"; 
import user2Image from "../assets/profile2.jpg"; 

// Import robot icon
import robotIcon from "../assets/robo.png"; 

const Page2 = () => {
  return (
    <div className="page2-container">
      <ReportTopBar />

      {/* Reports List */}
      <div className="reports-list">
        {/* Report 1 */}
        <div className="report-card">
          <div className="report-header">
            <div className="user-info">
              <img src={user1Image} alt="User Profile" className="user-image" />
              <div className="user-name-profile">
                <p className="user-name">Stanislav Naida</p>
                <p className="user-role">Plant Engineer</p>
              </div>
            </div>
            <div className="report-time-status">
              <p className="report-time">16h</p>
              <div className="report-status solved">Solved</div>
            </div>
          </div>
          <div className="report-details">
            <p className="report-title">Report Plant-8</p>
            <p className="report-issue">Issue# Pump stuck</p>
            <p className="report-description">
              We had an issue in the succession pump and the issue has been solved
              by cleaning the filter line.
            </p>
            <p className="see-more">see more</p>
          </div>
        </div>

        {/* Report 2 */}
        <div className="report-card">
          <div className="report-header">
            <div className="user-info">
              <img src={user2Image} alt="User Profile" className="user-image" />
              <div className="user-name-profile">
                <p className="user-name">John Doe</p>
                <p className="user-role">Plant Engineer</p>
              </div>
            </div>
            <div className="report-time-status">
              <p className="report-time">17h</p>
              <div className="report-status solved">Solved</div>
            </div>
          </div>
          <div className="report-details">
            <p className="report-title">Report Plant-9</p>
            <p className="report-issue">Issue# Valve not opening</p>
            <p className="report-description">
              We had an issue in the valve and the issue has been solved by
              cleaning the filter line.
            </p>
            <p className="see-more">see more</p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="footer-note">
        <p className="footer-text">
          All the Reports will be analyzed by AI to send summary to Management,
          the same will be used to analyze and troubleshoot future similar issues.
        </p>
        <img src={robotIcon} alt="Robot Icon" className="robot-icon" />
      </div>
    </div>
  );
};

export default Page2;
