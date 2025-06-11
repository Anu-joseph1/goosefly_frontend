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

  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem("authToken");
    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }
      return response;
    } catch (err) {
      console.error("API call failed:", err);
      throw err;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await authFetch(`http://172.16.11.171:8000/all-comments?post_id=${postId}`);
        const data = await response.json();
        
        const transformedComments = data.map(comment => ({
          comment_id: comment.comment_id,
          user: comment.user_name,
          text: comment.text,
          time: new Date(comment.created_at).toLocaleString(),
          profile_pic: comment.profile_pic,
          replies: comment.replies,
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

    if (showComments) {
      fetchComments();
    }
  }, [showComments, postId]);

  const handleUpvote = async () => {
    try {
      const newUpvoteStatus = !isUpvoted;
      const response = await authFetch(`http://172.16.11.171:8000/upvote-post`, {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
          upvote: newUpvoteStatus
        })
      });
      
      if (response.ok) {
        setIsUpvoted(newUpvoteStatus);
        setUpvoteCount(newUpvoteStatus ? upvoteCount + 1 : upvoteCount - 1);
      }
    } catch (err) {
      console.error("Error updating upvote:", err);
    }
  };

  const handleAddComment = async (commentText) => {
    try {
      setError(null);
      
      const response = await authFetch('http://172.16.11.171:8000/write-comments', {
        method: 'POST',
        body: JSON.stringify({
          post_id: postId,
          text: commentText
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setCommentList(prevComments => [{
          comment_id: newComment.comment_id,
          user: "You",
          text: newComment.text,
          time: new Date().toLocaleString(),
          profile_pic: "",
          replies: [],
          post_id: postId
        }, ...prevComments]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await authFetch(`http://172.16.11.171:8000/delete-comment/${commentId}`, {
        method: 'DELETE'
      });
      setCommentList(prev => prev.filter(c => c.comment_id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  return (
    <div className="reaction-container">
      <div className="reaction-stats">
        <span className="reaction-count">{upvoteCount} 👍</span>
        <span className="reaction-count">{commentList.length} comments</span>
        <span className="reaction-count">{shares} shares</span>
      </div>

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
        <div className="comments-section">
          {loading ? (
            <div className="loading">Loading comments...</div>
          ) : error ? (
            <div className="error">Error: {error}</div>
          ) : (
            <CommentSection
              comments={commentList}
              onAddComment={handleAddComment}
              onDeleteComment={handleDeleteComment}
              onClose={() => setShowComments(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ReactionSection;