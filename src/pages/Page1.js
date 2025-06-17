import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import EmployeePost from "../components/EmployeePost";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "http://172.16.11.53:8000";

const Page1 = ({ isOpen }) => {
  const navigate = useNavigate();
  const [combinedPosts, setCombinedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced token validation
  const validateToken = (token) => {
    if (!token) {
      return { valid: false, reason: "No token provided" };
    }
    
    try {
      const decoded = jwtDecode(token);
      
      // Check expiration
      if (decoded.exp * 1000 < Date.now()) {
        return { valid: false, reason: "Token expired" };
      }
      
      // Check required claims (customize based on your requirements)
      if (!decoded["cognito:groups"] || !decoded["cognito:groups"].includes("Admin")) {
        return { valid: false, reason: "Insufficient permissions" };
      }
      
      return { valid: true, decoded };
    } catch (e) {
      return { valid: false, reason: "Invalid token" };
    }
  };

  // Enhanced authenticated fetch wrapper
  const authFetch = async (url, options = {}, timeout = 8000) => {
    const token = localStorage.getItem("authToken");
    const validation = validateToken(token);
    
    if (!validation.valid) {
      localStorage.removeItem("authToken");
      navigate("/", { state: { authError: validation.reason } });
      return Promise.reject(new Error(`Authentication failed: ${validation.reason}`));
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
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
        credentials: 'include' // Include credentials if needed
      });

      clearTimeout(timeoutId);

      // Handle specific error cases
      if (response.status === 401) {
        localStorage.removeItem("authToken");
        navigate("/", { state: { authError: "Session expired" } });
        throw new Error("Authentication failed: Session expired");
      }

      if (response.status === 403) {
        throw new Error("Forbidden: You don't have permission to access this resource");
      }

      if (response.status === 404) {
        throw new Error("Resource not found");
      }

      // Handle CORS errors
      if (response.type === 'opaque' || response.type === 'opaqueredirect') {
        throw new Error("CORS error: Could not access the resource");
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
      
      // Handle network errors specifically
      if (error.name === 'AbortError') {
        throw new Error("Request timeout: Server took too long to respond");
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error("Network error: Could not connect to the server");
      }
      
      throw error;
    }
  };

  // Construct proper image URLs with error handling
  const constructImageUrl = (path) => {
    if (!path) return '/default-profile.png';
    try {
      if (path.startsWith('http')) return path;
      if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
      return `${API_BASE_URL}/${path}`;
    } catch (e) {
      console.error("Error constructing image URL:", e);
      return '/default-profile.png';
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const validation = validateToken(token);
    
    if (!validation.valid) {
      localStorage.removeItem("authToken");
      navigate("/", { state: { authError: validation.reason } });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First endpoint: Get all posts
        const postResponse = await authFetch(`${API_BASE_URL}/all-posts`);
        
        // Check content type to ensure we're getting JSON
        const contentType = postResponse.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error("Server returned non-JSON response");
        }
        
        const postData = await postResponse.json();

        if (!postData.posts || !Array.isArray(postData.posts)) {
          throw new Error("Invalid post data format");
        }

        // Create initial posts with placeholder user data
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

        // Second endpoint: Get user details by ID for each post
        const updatedPosts = await Promise.all(
          postData.posts.map(async (post) => {
            try {
              const userResponse = await authFetch(
                `${API_BASE_URL}/by_id?user_id=${post.user_id}`
              );
              
              // Check if user response is valid
              if (!userResponse.ok) {
                throw new Error(`Failed to fetch user ${post.user_id}`);
              }
              
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
                profilePic: "/default-profile.png",
                error: `Failed to load user details: ${error.message}`
              };
            }
          })
        );

        setCombinedPosts(updatedPosts);
      } catch (err) {
        // Handle specific error cases
        if (err.message.includes("Authentication failed") || 
            err.message.includes("Session expired")) {
          return; // Already handled by authFetch
        }
        
        if (err.message.includes("Forbidden")) {
          setError("Access denied: You don't have permission to view this content");
        } else if (err.message.includes("CORS error")) {
          setError("Cross-origin request blocked. Please contact support.");
        } else if (err.message.includes("Network error")) {
          setError("Network connection failed. Please check your internet connection.");
        } else {
          setError(err.message || "Failed to load posts");
        }
        
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
        <p className="error-message">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Try Again
        </button>
        {error.includes("Authentication") && (
          <button 
            onClick={() => navigate("/")}
            className="login-button"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`page1-container ${isOpen ? '' : 'expanded'}`}>
      {combinedPosts.length > 0 ? (
        combinedPosts.map((post) => (
          <div key={post.post_id} className="post-container">
            <EmployeePost
              employee={post}
              goToProfile={() => goToProfile(post.user_id)}
            />
            {post.error && (
              <div className="post-error">
                <small>{post.error}</small>
              </div>
            )}
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