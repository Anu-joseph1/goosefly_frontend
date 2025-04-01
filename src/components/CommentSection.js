import React, { useState } from "react";
import "./CommentSection.css";
import ConfirmationModal from "./ConfirmationModal";

const CommentSection = ({ comments, onAddComment, onClose, onDeleteComment }) => {
  const [newComment, setNewComment] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

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
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="comment-header">
              <span className="comment-user">{comment.user}</span>
              <span className="comment-time">{comment.time}</span>
            </div>
            {comment.text && <div className="comment-text">{comment.text}</div>}
            <div className="comment-actions">
              <button className="reply-button">Reply</button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteClick(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
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