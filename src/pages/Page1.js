import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import EmployeePost from "../components/EmployeePost";
import { fetchAuthSession } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import awsconfig from "../aws-exports";

// Configure Amplify
Amplify.configure(awsconfig);

const Page1 = ({ isOpen }) => {
  const navigate = useNavigate();
  const [combinedPosts, setCombinedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get JWT token from Cognito
  const getAuthToken = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      if (!tokens?.idToken) {
        throw new Error("No ID token found");
      }
      return tokens.idToken.toString();
    } catch (err) {
      console.error("Error getting token:", err);
      throw new Error("Authentication required. Please sign in.");
    }
  };

  // Enhanced fetch function with retry logic
  const fetchWithAuth = async (url, retries = 3) => {
    const token = await getAuthToken();
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 401) {
          // Token might be expired, try refreshing
          if (i === 0) {
            try {
              await fetchAuthSession({ forceRefresh: true });
              continue;
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              throw new Error("Session expired. Please login again.");
            }
          }
          throw new Error("Unauthorized access");
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (err) {
        if (i === retries - 1) throw err;
        // Wait for 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Fetch data from both endpoints with authentication
        const [userData, postData] = await Promise.all([
          fetchWithAuth("http://172.16.11.171:8000/all"),
          fetchWithAuth("http://172.16.11.171:8000/all-posts"),
        ]);

        if (!isMounted) return;

        // Create a map of users for quick lookup
        const userMap = new Map(
          userData.map((user) => [user.user_id, user])
        );

        // Combine posts with user data
        const combined = postData.posts.map((post) => {
          const user = userMap.get(post.user_id) || {};
          return {
            post_id: post.post_id,
            user_id: post.user_id,
            name: user.name || "Unknown User",
            designation: user.designation || "",
            profile_pic: user.profile_pic || "default-profile.jpg",
            image_url: post.image_url,
            caption: post.caption || "",
            created_at: post.created_at,
            upvotes: post.upvotes || 0,
            comments: post.comments || 0,
            shares: post.shares || 0,
          };
        });

        setCombinedPosts(combined);
      } catch (err) {
        if (!isMounted) return;
        
        setError(err.message);
        if (
          err.message.includes("Authentication") ||
          err.message.includes("Unauthorized") ||
          err.message.includes("Session expired")
        ) {
          navigate("/login", { state: { from: window.location.pathname } });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const goToProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Content</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()}>Retry</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`page1-container ${isOpen ? "shifted" : ""}`}>
      {combinedPosts.length > 0 ? (
        combinedPosts
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((post) => (
            <EmployeePost
              key={post.post_id}
              employee={post}
              goToProfile={() => goToProfile(post.user_id)}
            />
          ))
      ) : (
        <div className="no-posts">
          <p>No posts available</p>
        </div>
      )}
    </div>
  );
};

export default Page1;