import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeePost from "../components/EmployeePost";
import { FaArrowLeft, FaPlus, FaBell } from "react-icons/fa";
import "./page4.css";

const Page4 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch user details
        const userResponse = await fetch(`http://172.16.10.144:8000/all`);
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const users = await userResponse.json();
        const user = users.find(u => u.user_id === userId);
        
        if (!user) {
          throw new Error("User not found");
        }

        // Fetch user's posts
        const postsResponse = await fetch("http://172.16.10.144:8000/all-posts");
        if (!postsResponse.ok) {
          throw new Error("Failed to fetch posts");
        }
        const postsData = await postsResponse.json();
        const userPosts = postsData.posts
          .filter(post => post.user_id === userId)
          .map(post => ({
            post_id: post.post_id,
            user_id: post.user_id,
            name: user.name,
            designation: user.designation,
            profilePic: user.profile_pic,
            postImage: post.image_url,
            caption: post.caption,
            postTime: post.created_at,
            upvotes: user.upvotes || 0,
            comments: user.comments || 0,
            shares: user.shares || 0,
            plant: post.plant || 1
          }));

        setUserDetails(user);
        setUserPosts(userPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userDetails) {
    return <div>User not found</div>;
  }

  return (
    <div className="container">
      {/* Profile Section */}
      <div className="profile">
        <div className="header">
          <FaArrowLeft className="back" onClick={() => navigate(-1)} />
          <div className="profile-content">
            <img src={userDetails.profile_pic} alt="Profile" className="image" />
            <div className="details">
              <h2 className="name">{userDetails.name}</h2>
              <p className="text">{userDetails.designation}</p>
              <p className="text">@{userDetails.username}</p>
              <p className="text">{userDetails.bio}</p>
              <div className="stats">
                <div className="numbers">
                  <span className="text">{userDetails.followers || 0} Followers</span>
                  <span className="text">{userDetails.experts || 0} Experts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      <div className="posts-container">
        {userPosts.map((post) => (
          <EmployeePost
            key={post.post_id}
            employee={post}
            goToProfile={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default Page4;