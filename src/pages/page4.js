import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeePost from "../components/EmployeePost";
import { FaArrowLeft, FaEllipsisV, FaEnvelope } from "react-icons/fa";
import "./page4.css";

// Constants
const API_BASE = "http://172.16.10.13:8000";

// Utility functions
const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

const handleApiError = (error) => {
  console.error("API Error:", error);
  if (error.message.includes("Failed to fetch")) {
    return "Network error - please check your connection";
  }
  return error.message || "An unknown error occurred";
};

const Page4 = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employeePosts, setEmployeePosts] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    industry: "",
    bio: "",
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch user data using /by_id endpoint
        try {
          const userResponse = await fetchWithRetry(
            `${API_BASE}/by_id?user_id=${employeeId}`
          );
          const userData = await userResponse.json();
          setEmployeeDetails(userData);
          setFormData({
            name: userData.name || "",
            designation: userData.designation || "",
            industry: userData.industry || "",
            bio: userData.bio || "",
          });
        } catch (userError) {
          throw new Error("Failed to fetch employee data");
        }

        // Fetch posts using /posts-by-user endpoint
        try {
          const postsResponse = await fetchWithRetry(
            `${API_BASE}/posts-by-user/${employeeId}`
          );
          const postsData = await postsResponse.json();
          // Transform S3 image data into post format
          const transformedPosts = postsData.images.map((image, index) => ({
            post_id: index + 1,
            image_url: image.image_url,
            caption: "",
            created_at: image.last_modified,
            upvotes: 0,
            comments: 0,
            shares: 0
          }));
          setEmployeePosts(transformedPosts);
        } catch (postsError) {
          console.error("Failed to fetch posts, using empty array", postsError);
          setEmployeePosts([]);
        }

      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        
        if (process.env.NODE_ENV === 'development') {
          console.warn("Using dummy data as fallback");
          const dummyData = {
            user_id: employeeId,
            name: "Dummy User",
            designation: "Developer",
            profile_pic: "default-profile.jpg",
            bio: "This is dummy data",
            username: "dummyuser",
            followers: 42,
            experts: 7
          };
          setEmployeeDetails(dummyData);
          setEmployeePosts([{
            post_id: 1,
            caption: "Sample post from dummy data",
            created_at: new Date().toISOString(),
            upvotes: 0,
            comments: 0,
            shares: 0,
            image_url: "default-post.jpg"
          }]);
          setError(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId]);

  const handleMessageClick = () => {
    navigate(`/chat/${employeeId}`, {
      state: {
        recipient: employeeDetails
      }
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()}>Retry</button>
          <button onClick={() => navigate(-1)}>Go Back</button>
          {process.env.NODE_ENV === 'development' && (
            <button onClick={() => console.error(error)}>View Error Details</button>
          )}
        </div>
      </div>
    );
  }

  if (!employeeDetails) {
    return (
      <div className="not-found-container">
        <h3>Employee Not Found</h3>
        <p>The requested employee profile could not be found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Profile Section */}
      <div className="profile">
        <div className="header">
          <FaArrowLeft className="back" onClick={() => navigate(-1)} />
          <div className="profile-content">
            <img 
              src={employeeDetails.profile_pic || "default-profile.jpg"} 
              alt="Profile" 
              className="image"
              onError={(e) => {
                e.target.src = "default-profile.jpg";
              }}
            />
            <div className="details">
              <h2 className="name">{employeeDetails.name}</h2>
              <p className="text">{employeeDetails.designation}</p>
              <p className="text">@{employeeDetails.username || employeeDetails.name.replace(/\s+/g, '').toLowerCase()}</p>
              <p className="text">{employeeDetails.bio}</p>
              <div className="stats">
                <button className="btn message-btn" onClick={handleMessageClick}>
                  <FaEnvelope className="message-icon" /> Message
                </button>
                <div className="numbers">
                  <span className="text">{employeeDetails.followers || 0} Followers</span>
                  <span className="text">{employeeDetails.experts || 0} Experts</span>
                </div>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="actions">
            <div className="menu-container">
              <FaEllipsisV className="icon menu-icon" onClick={toggleMenu} />
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <div className="menu-item" onClick={() => navigate('/create-post')}>New Post</div>
                  <div className="menu-item" onClick={() => navigate('/create-issue')}>Create Issue</div>
                  <div className="menu-item" onClick={() => navigate('/add-suggestion')}>Add Suggestion</div>
                  <div className="menu-item" onClick={() => navigate('/settings')}>Settings</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Posts */}
      <div className="posts-container">
        {employeePosts.length > 0 ? (
          employeePosts.map((post) => (
            <EmployeePost 
              key={post.post_id} 
              employee={{
                ...post,
                name: employeeDetails.name,
                designation: employeeDetails.designation,
                profile_pic: employeeDetails.profile_pic
              }} 
              goToProfile={() => {}} 
            />
          ))
        ) : (
          <div className="no-posts">
            <p>No posts available for this employee</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page4;