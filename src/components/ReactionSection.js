import React from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";

const ReactionSection = ({ upvotes, comments, shares }) => {
  return (
    <div className="reaction-container">
      {/* Reaction Stats */}
      <div className="reaction-stats">
        <span className="reaction-count">{upvotes} 👍</span>
        <span className="reaction-count">{comments} comments</span>
        <span className="reaction-count">{shares} shares</span>
      </div>

      {/* Reaction Buttons */}
      <div className="reaction-buttons">
        <div className="reaction-item">
          <FaThumbsUp className="reaction-icon" />
          <span className="reaction-text">Upvote</span>
        </div>
        <div className="reaction-item">
          <FaComment className="reaction-icon" />
          <span className="reaction-text">Comment</span>
        </div>
        <div className="reaction-item">
          <FaShare className="reaction-icon" />
          <span className="reaction-text">Share</span>
        </div>
      </div>
    </div>
  );
};

export default ReactionSection;
