import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import EmployeePost from "../components/EmployeePost";

const API_BASE_URL = "http://172.16.10.13:8000";

const Page1 = ({ isOpen }) => {
  const navigate = useNavigate();
  const [combinedPosts, setCombinedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from all three endpoints simultaneously
        const [userResponse, postResponse, commentsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/all`),
          fetch(`${API_BASE_URL}/all-posts`),
          fetch(`${API_BASE_URL}/all-comments`),
        ]);

        // Check if all responses are OK
        if (!userResponse.ok || !postResponse.ok || !commentsResponse.ok) {
          throw new Error("Failed to fetch data from one or more endpoints");
        }

        // Parse JSON responses
        const [userData, postData, commentsData] = await Promise.all([
          userResponse.json(),
          postResponse.json(),
          commentsResponse.json(),
        ]);

        // Create a map of users for quick lookup
        const userMap = new Map(
          userData.map(user => [user.user_id, user])
        );

        // Create a map of comments grouped by post_id
        const commentsMap = new Map();
        if (Array.isArray(commentsData)) {
          commentsData.forEach(comment => {
            if (!comment.post_id) return; // Skip if post_id is missing
            
            if (!commentsMap.has(comment.post_id)) {
              commentsMap.set(comment.post_id, []);
            }
            commentsMap.get(comment.post_id).push({
              comment_id: comment.comment_id,
              user_id: comment.user_id,
              text: comment.text,
              created_at: comment.created_at,
              replies: comment.replies || []
            });
          });
        }

        // Combine posts with user data and comments
        const combined = postData.posts.map(post => {
          const user = userMap.get(post.user_id) || {};
          const postComments = commentsMap.get(post.post_id) || [];
          
          return {
            post_id: post.post_id,
            user_id: post.user_id,
            name: user.name,
            designation: user.designation,
            profile_pic: user.profile_pic,
            image_url: post.image_url,
            caption: post.caption,
            created_at: post.created_at,
            upvotes: user.upvotes || 0,
            comments: postComments, // Array of comment objects
            commentCount: postComments.length, // Total number of comments
            shares: user.shares || 0
          };
        });

        setCombinedPosts(combined);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="page1-container">
      {combinedPosts.map((post) => (
        <EmployeePost
          key={post.post_id}
          employee={post}
          goToProfile={() => goToProfile(post.user_id)}
        />
      ))}
    </div>
  );
};

export default Page1;