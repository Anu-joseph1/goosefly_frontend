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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    industry: "",
    bio: "",
  });

  useEffect(() => {
    const fetchMyProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dummyData = {
          user_id: "user_123",
          name: currentUser || "Akhila",
          designation: "Software Developer",
          profile_pic: "default-profile.jpg",
          bio: "Passionate developer with 5 years of experience in React and Node.js",
          username: currentUser ? currentUser.toLowerCase() : "akhila",
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

        const dummyPosts = [
          {
            post_id: 1,
            image_url: "default-post.jpg",
            caption: "Working on a new project!",
            created_at: new Date().toISOString(),
            upvotes: 24,
            comments: 5,
            shares: 2
          },
          {
            post_id: 2,
            image_url: "default-post.jpg",
            caption: "Just deployed our new feature",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            upvotes: 42,
            comments: 8,
            shares: 3
          }
        ];
        
        setEmployeePosts(dummyPosts);
        
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmployeeDetails({
      ...employeeDetails,
      ...formData,
    });
    setIsModalOpen(false);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
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
                  <div className="item" onClick={() => navigate('/create-post')}>New Post</div>
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
            <p>No posts available</p>
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
                />
              </label>
              <label>
                Bio:
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="4"
                />
              </label>
              <div className="buttons">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
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