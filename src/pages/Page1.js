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

        const fetchWithTimeout = (url, options = {}, timeout = 8000) => {
          return Promise.race([
            fetch(url, options),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
          ]);
        };

        // Only fetch users and posts now
        const [userResponse, postResponse] = await Promise.all([
          fetchWithTimeout(`${API_BASE_URL}/all`).catch(e => { throw new Error(`Users: ${e.message}`) }),
          fetchWithTimeout(`${API_BASE_URL}/all-posts`).catch(e => { throw new Error(`Posts: ${e.message}`) })
        ]);

        if (!userResponse.ok) throw new Error(`User data failed: ${userResponse.status}`);
        if (!postResponse.ok) throw new Error(`Post data failed: ${postResponse.status}`);

        const [userData, postData] = await Promise.all([
          userResponse.json(),
          postResponse.json()
        ]);

        // Create a map of users for quick lookup
        const userMap = new Map(userData.map(user => [user.user_id, user]));

        // Combine posts with user data (without comments)
        const combined = postData.posts?.map(post => {
          const user = userMap.get(post.user_id) || {};
          
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
        <div key={post.post_id} className="post-container">
          <EmployeePost
            employee={post}
            goToProfile={() => goToProfile(post.user_id)}
          />
        </div>
      ))}
    </div>
  );
};

export default Page1;