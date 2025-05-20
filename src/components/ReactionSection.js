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

  useEffect(() => {
    if (!showComments) return; // Only fetch when comments are shown

    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch only comments for this specific post
        const response = await fetch(`http://172.16.10.13:8000/comments?post_id=${postId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch comments: ${response.status}`);
        }

        const data = await response.json();
        
        const transformedComments = data.map(comment => ({
          comment_id: comment.comment_id,
          user: comment.user_name,
          text: comment.text,
          time: new Date(comment.created_at).toLocaleString(),
          profile_pic: comment.profile_pic,
          replies: comment.replies || [],
          post_id: comment.post_id
        }));
        
        setCommentList(transformedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [showComments, postId]); // Only re-run when showComments or postId changes

  const handleUpvote = () => {
    const newValue = isUpvoted ? upvoteCount - 1 : upvoteCount + 1;
    setUpvoteCount(newValue);
    setIsUpvoted(!isUpvoted);
  };

  const handleAddComment = async (commentText) => {
    try {
      setError(null);
      
      const response = await fetch('http://172.16.10.13:8000/write-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: "current_user_id", // Replace with actual user ID
          text: commentText
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add comment: ${response.status}`);
      }

      const newComment = await response.json();
      setCommentList(prev => [{
        comment_id: newComment.comment_id,
        user: newComment.user_name,
        text: newComment.text,
        time: new Date().toLocaleString(),
        profile_pic: newComment.profile_pic,
        replies: [],
        post_id: postId
      }, ...prev]);
      
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="reaction-container">
      {/* Stats Row - Only show once */}
      <div className="reaction-stats">
        <span className="reaction-count">{upvoteCount} 👍</span>
        <span className="reaction-count">{commentList.length || initialCommentCount} comments</span>
        <span className="reaction-count">{shares} shares</span>
      </div>

      {/* Buttons Row - Only show once */}
      <div className="reaction-buttons">
        <div 
          className={`reaction-item ${isUpvoted ? 'active' : ''}`} 
          onClick={handleUpvote}
        >
          <FaThumbsUp className="reaction-icon" />
          <span className="reaction-text">Upvote</span>
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

      {/* Comments Section - Only shown when toggled */}
      {showComments && (
        <div className="comments-section">
          {loading ? (
            <div className="loading">Loading comments...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            <CommentSection
              comments={commentList}
              onAddComment={handleAddComment}
              onClose={() => setShowComments(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReactionSection;