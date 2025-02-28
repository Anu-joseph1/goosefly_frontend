import React from "react";
import ProfileSection from "./ProfileSection"; // Correct import path
import ActivitySection from "./ActivitySection"; // Correct import path
import ReactionSection from "./ReactionSection"; // Correct import path

const EmployeePost = ({ employee, goToProfile }) => {
  return (
    <div className="employee-post">
      <ProfileSection
        profilePic={employee.profilePic}
        name={employee.name}
        designation={employee.designation}
        postTime={employee.postTime}
        goToProfile={goToProfile}
      />
      <ActivitySection postImage={employee.postImage} caption={employee.caption} />
      <ReactionSection upvotes={employee.upvotes} shares={employee.shares} />
    </div>
  );
};

export default EmployeePost;