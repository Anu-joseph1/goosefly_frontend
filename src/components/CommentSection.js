import React, { useState } from "react";
import "./CommentSection.css";
import ConfirmationModal from "./ConfirmationModal";

const CommentSection = ({ comments, onAddComment, onClose, onDeleteComment }) => {
  const [newComment, setNewComment] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // Add console log to check received comments
  console.log("CommentSection received comments:", comments);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  const handleDeleteClick = (index) => {
    setCommentToDelete(index);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteComment(commentToDelete);
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  return (
    <div className="comment-section-container">
      {showDeleteModal && (
        <ConfirmationModal
          message="Do you want to delete the comment?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
      
      <div className="comment-section-header">
        <div className="comment-heading-container">
          <h3 className="comment-heading">Comments</h3>
          <div className="comment-subheading">For you</div>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.comment_id} className="comment-item">
              <div className="comment-header">
                <div className="comment-user-info">
                  {comment.profile_pic && (
                    <img 
                      src={comment.profile_pic} 
                      alt={comment.user} 
                      className="comment-user-avatar"
                    />
                  )}
                  <span className="comment-user">{comment.user}</span>
                </div>
                <span className="comment-time">{comment.time}</span>
              </div>
              {comment.text && <div className="comment-text">{comment.text}</div>}
              <div className="comment-actions">
                <button className="reply-button">Reply</button>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteClick(comment.comment_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="add-comment-form">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {newComment.trim() && (
          <button type="submit" className="post-button">Post</button>
        )}
      </form>
    </div>
  );
};

export default CommentSection;