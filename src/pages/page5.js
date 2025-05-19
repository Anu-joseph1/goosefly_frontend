import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeePost from "../components/EmployeePost";
import { FaArrowLeft, FaPlus, FaBell } from "react-icons/fa";
import "./page4.css";

const Page5 = ({ currentUser }) => {
  const navigate = useNavigate();
  const [employeePosts, setEmployeePosts] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    industry: "",
    bio: "",
  });
  const [postFormData, setPostFormData] = useState({
    image: null,
    caption: "",
    previewUrl: ""
  });

  useEffect(() => {
    const fetchMyProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use the currentUser prop as the name
        const username = currentUser || "Aneesha Antony"; // Default to "Aneesha Antony" if currentUser is not provided
        const lowercaseUsername = username.toLowerCase().replace(/\s+/g, '-');
        
        const dummyData = {
          user_id: "user_123",
          name: username,
          designation: "Software Developer",
          profile_pic: "default-profile.jpg",
          bio: "Passionate developer with 5 years of experience in React and Node.js",
          username: lowercaseUsername,
          followers: 128,
          experts: 15
        };
        
        setEmployeeDetails(dummyData);
        setFormData({
          name: dummyData.name,
          designation: dummyData.designation,
          industry: "Technology",
          bio: dummyData.bio,
        });

        // Start with empty posts array
        setEmployeePosts([]);
        
      } catch (err) {
        setError("Failed to load profile data");
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
    setEmployeeDetails({
      ...employeeDetails,
      ...formData,
    });
    setIsModalOpen(false);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    
    const newPost = {
      post_id: Date.now(), // Using timestamp as temporary ID
      image_url: postFormData.previewUrl || "default-post.jpg",
      caption: postFormData.caption,
      created_at: new Date().toISOString(),
      upvotes: 0,
      comments: 0,
      shares: 0,
      user_id: employeeDetails.user_id,
      name: employeeDetails.name,
      profile_pic: employeeDetails.profile_pic,
      designation: employeeDetails.designation
    };

    const updatedPosts = [newPost, ...employeePosts];
    setEmployeePosts(updatedPosts);
    
    // Save to localStorage
    localStorage.setItem('userPosts', JSON.stringify(updatedPosts));
    
    // Reset form and close modal
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

  if (!employeeDetails) {
    return <div className="not-found-container">Profile not found</div>;
  }

  return (
    <div className="container">
      <div className="profile">
        <div className="header">
          <FaArrowLeft className="back" onClick={() => navigate(-1)} />
          <div className="profile-content">
            <img 
              src={employeeDetails.profile_pic} 
              alt="Profile" 
              className="image"
              onError={(e) => {
                e.target.src = "default-profile.jpg";
              }}
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
                Industry:
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
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