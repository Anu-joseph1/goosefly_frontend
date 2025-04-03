import React, { useState, useEffect } from "react";
import { FaThumbsUp, FaComment, FaShare } from "react-icons/fa";
import CommentSection from "./CommentSection";

const ReactionSection = ({ upvotes, comments: initialCommentCount, shares, postId }) => {
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(upvotes);
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch comments when comment section is opened
  useEffect(() => {
    const fetchComments = async () => {
      if (showComments && postId) {
        try {
          setLoading(true);
          setError(null);
          
          // Add post_id to the URL
          const response = await fetch(`http://172.16.10.144:8000/read-comments?post_id=${postId}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch comments: ${response.status}`);
          }
          
          const data = await response.json();
          setCommentList(data);
        } catch (err) {
          setError(err.message);
          setCommentList([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchComments();
  }, [showComments, postId]);

  const handleUpvote = () => {
    if (isUpvoted) {
      setUpvoteCount(upvoteCount - 1);
    } else {
      setUpvoteCount(upvoteCount + 1);
    }
    setIsUpvoted(!isUpvoted);
  };

  const handleAddComment = async (commentText) => {
    try {
      setError(null);
      
      // Validate comment before sending
      if (!commentText || commentText.trim().length === 0) {
        throw new Error("Comment cannot be empty");
      }
      if (commentText.length > 500) {
        throw new Error("Comment must be 500 characters or less");
      }
  
      const response = await fetch('http://172.16.10.144:8000/write-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,  // Ensure this is the correct type (number/string)
          user_id: "current_user_id", // TODO: Replace with real user ID
          comment_text: commentText.trim(), // Try both 'comment_text' and 'text'
          // organization_id: null // Only include if required
        })
      });
  
      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Backend validation error:', responseData);
        throw new Error(responseData.detail || responseData.message || "Invalid comment format");
      }
  
      // Successful comment - add to list
      setCommentList(prev => [responseData, ...prev]);
      
    } catch (err) {
      console.error('Comment submission failed:', err);
      setError(
        err.message.includes("422") 
          ? "Please write a comment (1-500 characters, no special formatting)"
          : err.message
      );
    }
  };

  return (
    <div className="reaction-container">
      {/* Error display (if any) */}
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Reaction Stats */}
      <div className="reaction-stats">
        <span className="reaction-count">{upvoteCount} 👍</span>
        <span className="reaction-count">{commentList.length} comments</span>
        <span className="reaction-count">{shares} shares</span>
      </div>

      {/* Reaction Buttons */}
      <div className="reaction-buttons">
        <div 
          className={`reaction-item ${isUpvoted ? 'active' : ''}`} 
          onClick={handleUpvote}
        >
          <FaThumbsUp 
            className="reaction-icon" 
            style={{ color: isUpvoted ? '#1877f2' : 'inherit' }}
          />
          <span 
            className="reaction-text"
            style={{ color: isUpvoted ? '#1877f2' : 'inherit' }}
          >
            Upvote
          </span>
        </div>
        <div 
          className="reaction-item" 
          onClick={() => setShowComments(!showComments)}
        >
          <FaComment className="reaction-icon" />
          <span className="reaction-text">Comment</span>
        </div>
        <div className="reaction-item">
          <FaShare className="reaction-icon" />
          <span className="reaction-text">Share</span>
        </div>
      </div>

      {/* Comment Section */}
      {showComments && (
        <CommentSection
          comments={commentList}
          onAddComment={handleAddComment}
          onClose={() => setShowComments(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ReactionSection;
