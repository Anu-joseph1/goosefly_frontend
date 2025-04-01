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
      
      const response = await fetch('http://172.16.10.144:8000/write-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: "current_user_id", // Replace with actual user ID from your auth system
          text: commentText
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.status}`);
      }

      const newComment = await response.json();
      
      // Update the comment list with the new comment
      setCommentList(prevComments => [newComment, ...prevComments]);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    // Since you haven't provided a delete endpoint, we'll implement a frontend-only delete
    // Note: This will only remove the comment from the UI, not from the backend
    // In a production app, you should implement a proper DELETE endpoint
    setCommentList(prevComments => 
      prevComments.filter(comment => comment.comment_id !== commentId)
    );
    
    // Show warning that this is frontend-only
    setError("Note: Comment deletion is currently frontend-only. Refresh will bring it back.");
  };

  return (
    <div className="reaction-container">
      {/* Error display */}
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

      {showComments && (
        <CommentSection
          comments={commentList}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onClose={() => setShowComments(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ReactionSection;