import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import EmployeePost from "../components/EmployeePost";
import { jwtDecode } from "jwt-decode"; // Make sure to install this package

const API_BASE_URL = "http://172.16.10.13:8000";

const Page1 = ({ isOpen }) => {
  const navigate = useNavigate();
  const [combinedPosts, setCombinedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check if JWT token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true; // If token is invalid, consider it expired
    }
  };

  const authFetch = async (url, options = {}, timeout = 8000) => {
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      navigate("/"); // Redirect to home instead of non-existent login
      throw new Error("Authentication required");
    }

    // Check token expiration
    if (isTokenExpired(token)) {
      localStorage.removeItem("authToken");
      navigate("/");
      throw new Error("Session expired. Please login again.");
    }

    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("authToken");
        navigate("/");
        throw new Error("Authentication failed. Please login again.");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error(`Request to ${url} timed out`);
        throw new Error('Request timed out');
      }
      console.error(`Request to ${url} failed:`, error);
      throw error;
    }
  };

  const constructImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all posts
        const postResponse = await authFetch(`${API_BASE_URL}/all-posts`);
        const postData = await postResponse.json();

        if (!postData.posts || !Array.isArray(postData.posts)) {
          throw new Error("Invalid post data format");
        }

        // Create combined posts with placeholder user data first
        const initialCombined = postData.posts.map(post => ({
          post_id: post.post_id,
          user_id: post.user_id,
          name: `Loading user...`,
          designation: "",
          profilePic: "/default-profile.png",
          postImage: constructImageUrl(post.image_url),
          caption: post.caption || "",
          created_at: post.created_at,
          upvotes: post.upvotes || 0,
          shares: post.shares || 0,
          plant: post.plant || "unknown",
          type: post.type || "suggestion"
        }));

        setCombinedPosts(initialCombined);

        // Now fetch user details for each post and update
        const updatedPosts = await Promise.all(
          postData.posts.map(async (post) => {
            try {
              const userResponse = await authFetch(
                `${API_BASE_URL}/users/${post.user_id}`
              );
              const userData = await userResponse.json();
              
              return {
                ...post,
                name: userData.name || `User ${post.user_id}`,
                designation: userData.designation || "",
                profilePic: constructImageUrl(userData.profile_pic) || "/default-profile.png"
              };
            } catch (error) {
              console.error(`Failed to fetch user ${post.user_id}:`, error);
              return {
                ...post,
                name: `User ${post.user_id}`,
                designation: "",
                profilePic: "/default-profile.png"
              };
            }
          })
        );

        setCombinedPosts(updatedPosts);
      } catch (err) {
        if (err.message.includes("Authentication")) {
          return;
        }
        setError(err.message || "Failed to load posts");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
        <button onClick={() => {
          localStorage.removeItem("authToken");
          navigate("/");
        }}>Go to Home</button>
      </div>
    );
  }

  return (
    <div className="page1-container">
      {combinedPosts.length > 0 ? (
        combinedPosts.map((post) => (
          <div key={post.post_id} className="post-container">
            <EmployeePost
              employee={post}
              goToProfile={() => goToProfile(post.user_id)}
            />
          </div>
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
