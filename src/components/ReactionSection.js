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
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching comments...");

        const response = await fetch('http://172.16.10.13:8000/all-comments');
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error('Failed to fetch comments: ${response.status}');
        }

        const data = await response.json();
        console.log("Fetched comments:", data);
        
        // Transform the data to match the expected format
        const transformedComments = data.map(comment => ({
          comment_id: comment.comment_id,
          user: comment.user_name,
          text: comment.text,
          time: new Date(comment.created_at).toLocaleString(),
          profile_pic: comment.profile_pic,
          replies: comment.replies,
          post_id: comment.post_id
        }));
        
        console.log("Transformed comments:", transformedComments);
        setCommentList(transformedComments);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err.message);
        setCommentList([]);
      } finally {
        setLoading(false);
      }
    };

    // Fetch comments immediately when component mounts
    fetchComments();
  }, []); // Remove showComments dependency to fetch on mount

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
      
      const response = await fetch('http://172.16.10.13:8000/write-comments', {
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
        throw new Error('Failed to add comment: ${response.status}');
      }

      const newComment = await response.json();
      setCommentList(prevComments => [newComment, ...prevComments]);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setCommentList(prevComments => 
      prevComments.filter(comment => comment.comment_id !== commentId)
    );
  };

  return (
    <div className="reaction-container">
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