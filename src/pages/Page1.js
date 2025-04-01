import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import EmployeePost from "../components/EmployeePost";

const Page1 = ({ isOpen }) => {
  const navigate = useNavigate();
  const [combinedPosts, setCombinedPosts] = useState([]); // Single state for combined data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from both endpoints simultaneously
        const [userResponse, postResponse] = await Promise.all([
          fetch("http://172.16.10.144:8000/all"),
          fetch("http://172.16.10.144:8000/all-posts"),
        ]);

        // Check if both responses are OK
        if (!userResponse.ok || !postResponse.ok) {
          throw new Error("Failed to fetch data from one or both endpoints");
        }

        // Parse JSON responses
        const userData = await userResponse.json();
        const postData = await postResponse.json();

        // Create a map of users for quick lookup
        const userMap = new Map(
          userData.map(user => [user.user_id, user])
        );

        // Combine posts with user data
        const combined = postData.posts.map(post => {
          const user = userMap.get(post.user_id) || {};
          return {
            post_id: post.post_id,
            user_id: post.user_id,
            name: user.name,
            designation: user.designation,
            profile_pic: user.profile_pic,
            image_url: post.image_url,
            caption: post.caption,
            created_at: post.created_at,
            upvotes: user.upvotes || 0,
            comments: user.comments || 0,
            shares: user.shares || 0
          };
        });

        setCombinedPosts(combined);
      } catch (err) {
        setError(err.message);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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