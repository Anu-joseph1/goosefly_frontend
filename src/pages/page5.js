import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeePost from "../components/EmployeePost";
import { FaArrowLeft, FaPlus, FaBell } from "react-icons/fa";
import "./page4.css";

const Page5 = ({ currentUser }) => {
  const navigate = useNavigate();
  const [employeePosts, setEmployeePosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    bio: "",
  });
  const [postFormData, setPostFormData] = useState({
    image: null,
    caption: "",
    previewUrl: ""
  });

  // Default user data structure matching your screenshot
  const [employeeDetails, setEmployeeDetails] = useState({
    name: "",
    designation: "",
    username: "",
    bio: "",
    followers: 0,
    experts: 0
  });

  useEffect(() => {
    const fetchMyProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!currentUser) {
          throw new Error("No user logged in");
        }

        // Extract username from email (first part before @)
        const username = currentUser.username || 
                       (currentUser.attributes?.email ? 
                        currentUser.attributes.email.split('@')[0] : 
                        'user');

        // Set profile data based on currentUser
        const profileData = {
          name: currentUser.attributes?.name || "Aneesha Antony",
          designation: "Software Developer",
          username: username.toLowerCase(),
          bio: "Passionate developer with 5 years of experience in React and Node.js",
          followers: 128,
          experts: 15
        };

        setEmployeeDetails(profileData);
        setFormData({
          name: profileData.name,
          designation: profileData.designation,
          bio: profileData.bio,
        });

        // Load user posts from localStorage if available
        const savedPosts = JSON.parse(localStorage.getItem('userPosts')) || [];
        setEmployeePosts(savedPosts);

      } catch (err) {
        setError("Failed to load profile data. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProfileData();
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePostInputChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPostFormData({
          ...postFormData,
          image: file,
          previewUrl
        });
      }
    } else {
      const { name, value } = e.target;
      setPostFormData({
        ...postFormData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      ...employeeDetails,
      ...formData
    };
    setEmployeeDetails(updatedProfile);
    setIsModalOpen(false);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      post_id: Date.now(),
      image_url: postFormData.previewUrl || "default-post.jpg",
      caption: postFormData.caption,
      created_at: new Date().toISOString(),
      upvotes: 0,
      comments: 0,
      shares: 0,
      user_id: currentUser?.username || "user123",
      name: employeeDetails.name,
      profile_pic: "default-profile.jpg",
      designation: employeeDetails.designation
    };

    const updatedPosts = [newPost, ...employeePosts];
    setEmployeePosts(updatedPosts);
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts));
    
    setPostFormData({
      image: null,
      caption: "",
      previewUrl: ""
    });
    setIsPostModalOpen(false);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const openPostModal = () => {
    setIsPostModalOpen(true);
    setIsPopupOpen(false);
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="container">
      <div className="profile">
        <div className="header">
          <FaArrowLeft className="back" onClick={() => navigate(-1)} />
          <div className="profile-content">
            <img 
              src="default-profile.jpg" 
              alt="Profile" 
              className="image"
            />
            <div className="details">
              <h2 className="name">{employeeDetails.name}</h2>
              <p className="text">{employeeDetails.designation}</p>
              <p className="text">@{employeeDetails.username}</p>
              <p className="text">{employeeDetails.bio}</p>
              <div className="stats">
                <button className="btn" onClick={() => setIsModalOpen(true)}>
                  Edit Profile
                </button>
                <div className="numbers">
                  <span className="text">{employeeDetails.followers} Followers</span>
                  <span className="text">{employeeDetails.experts} Experts</span>
                </div>
              </div>
            </div>
          </div>
          <div className="actions">
            <FaBell className="icon notification" />
            <div className="popup">
              <FaPlus className="icon popup" onClick={togglePopup} />
              {isPopupOpen && (
                <div className="menu">
                  <div className="item" onClick={openPostModal}>New Post</div>
                  <div className="item" onClick={() => navigate('/create-issue')}>Create a New Issue</div>
                  <div className="item" onClick={() => navigate('/add-suggestion')}>Add a Suggestion</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="posts-container">
        {employeePosts.length > 0 ? (
          employeePosts.map((post) => (
            <EmployeePost 
              key={post.post_id} 
              employee={post} 
              goToProfile={() => {}} 
            />
          ))
        ) : (
          <div className="no-posts">
            <p>No posts available. Create your first post!</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="overlay">
          <div className="modal">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Designation:
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Bio:
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
              </label>
              <div className="buttons">
                <button type="submit">Save</button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPostModalOpen && (
        <div className="overlay">
          <div className="modal post-modal">
            <h2>Create New Post</h2>
            <form onSubmit={handlePostSubmit}>
              <div className="image-upload">
                {postFormData.previewUrl ? (
                  <img 
                    src={postFormData.previewUrl} 
                    alt="Preview" 
                    className="image-preview"
                  />
                ) : (
                  <div className="upload-placeholder">
                    <p>Select an image to upload</p>
                  </div>
                )}
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handlePostInputChange}
                  required
                />
              </div>
              <label>
                Caption:
                <textarea
                  name="caption"
                  value={postFormData.caption}
                  onChange={handlePostInputChange}
                  rows="3"
                  required
                />
              </label>
              <div className="buttons">
                <button type="submit">Post</button>
                <button 
                  type="button" 
                  onClick={() => setIsPostModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page5;