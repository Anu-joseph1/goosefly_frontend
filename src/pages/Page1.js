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

        // Fetch data from all three endpoints with error handling for each
        const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
          return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
          ]);
        };

        const [userResponse, postResponse, commentsResponse] = await Promise.all([
          fetchWithTimeout(`${API_BASE_URL}/all`).catch(e => { throw new Error(`Users: ${e.message}`) }),
          fetchWithTimeout(`${API_BASE_URL}/all-posts`).catch(e => { throw new Error(`Posts: ${e.message}`) }),
          fetchWithTimeout(`${API_BASE_URL}/all-comments`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          }).catch(e => { throw new Error(`Comments: ${e.message}`) })
        ]);

        // Check if all responses are OK
        if (!userResponse.ok) throw new Error(`User data failed: ${userResponse.status}`);
        if (!postResponse.ok) throw new Error(`Post data failed: ${postResponse.status}`);
        if (!commentsResponse.ok) throw new Error(`Comment data failed: ${commentsResponse.status}`);

        // Parse JSON responses
        const [userData, postData, commentsData] = await Promise.all([
          userResponse.json(),
          postResponse.json(),
          commentsResponse.json().catch(e => {
            console.error("Failed to parse comments JSON:", e);
            return []; // Return empty array if parsing fails
          })
        ]);

        // Create a map of users for quick lookup
        const userMap = new Map(
          userData.map(user => [user.user_id, user])
        );

        // Create a map of comments grouped by post_id
        const commentsMap = new Map();
        
        // Handle case where commentsData might be an object or array
        const commentsArray = Array.isArray(commentsData) ? commentsData : 
                             (commentsData.comments || commentsData.items || []);
        
        commentsArray.forEach(comment => {
          if (!comment.post_id) return; // Skip if post_id is missing
          
          if (!commentsMap.has(comment.post_id)) {
            commentsMap.set(comment.post_id, []);
          }
          commentsMap.get(comment.post_id).push({
            comment_id: comment.comment_id,
            user_id: comment.user_id,
            text: comment.text,
            created_at: comment.created_at,
            replies: comment.replies || [],
            user_name: comment.user_name || "Unknown",
            profile_pic: comment.profile_pic || ""
          });
        });

        // Combine posts with user data and comments
        const combined = postData.posts?.map(post => {
          const user = userMap.get(post.user_id) || {};
          const postComments = commentsMap.get(post.post_id) || [];
          
          return {
            post_id: post.post_id,
            user_id: post.user_id,
            name: user.name || "Unknown",
            designation: user.designation || "",
            profile_pic: user.profile_pic || "",
            image_url: post.image_url || "",
            caption: post.caption || "",
            created_at: post.created_at,
            upvotes: user.upvotes || 0,
            comments: postComments,
            commentCount: postComments.length,
            shares: user.shares || 0
          };
        }) || [];

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