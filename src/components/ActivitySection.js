import React from "react";

const ActivitySection = ({ postImage, caption }) => {
  return (
    <div className="activity-container">
      <div className="activity-image">
        <img src={postImage} alt="Post" />
      </div>
      <textarea className="caption-box" placeholder={caption} readOnly></textarea>
    </div>
  );
};

export default ActivitySection;