import React from "react";
import ProfileSection from "./ProfileSection";
import ActivitySection from "./ActivitySection";
import ReactionSection from "./ReactionSection";
import { FaEllipsisH } from "react-icons/fa";

const EmployeePost = ({ employee, goToProfile }) => {
  return (
    <div className="employee-post">
      <div className="post-header">
        <span>
          {employee.type === "issue"
            ? `New issue created at plant ${employee.plant}`
            : `New suggestion created at plant ${employee.plant}`}
        </span>
        <div className="ellipsis-icon">
          <FaEllipsisH />
        </div>
      </div>

      <ProfileSection
        profilePic={employee.profilePic}
        name={employee.name}
        designation={employee.designation}
        postTime={employee.created_at}
        goToProfile={goToProfile}
      />
      
      <ActivitySection 
        postImage={employee.postImage} 
        caption={employee.caption} 
      />
      
      <ReactionSection 
        upvotes={employee.upvotes} 
        shares={employee.shares} 
      />
    </div>
  );
};

export default EmployeePost;