import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeePost from "../components/EmployeePost";
import { employees } from "../data/employees";
import { FaArrowLeft, FaPlus, FaBell } from "react-icons/fa";
import "./page4.css";

const Page4 = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employeePosts, setEmployeePosts] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    industry: "",
    bio: "",
  });

  useEffect(() => {
    const selectedEmployee = employees.find((emp) => emp.id === parseInt(employeeId));
    if (selectedEmployee) {
      setEmployeeDetails(selectedEmployee);
      setFormData({
        name: selectedEmployee.name,
        designation: selectedEmployee.designation,
        industry: selectedEmployee.industry || "",
        bio: selectedEmployee.bio,
      });
      const filteredPosts = employees.filter((emp) => emp.id === parseInt(employeeId));
      setEmployeePosts(filteredPosts);
    }
  }, [employeeId]);

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

  if (!employeeDetails) {
    return <div>Employee not found.</div>;
  }

  return (
    <div className="container">
      {/* Profile Section */}
      <div className="profile">
        <div className="header">
          <FaArrowLeft className="back" onClick={() => navigate(-1)} />
          <div className="profile-content">
            <img src={employeeDetails.profilePic} alt="Profile" className="image" />
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
          {/* Actions */}
          <div className="actions">
            <FaBell className="icon notification" />
            <div className="popup">
              <FaPlus className="icon popup" onClick={togglePopup} />
              {isPopupOpen && (
                <div className="menu">
                  <div className="item">New Post</div>
                  <div className="item">Create a New Issue</div>
                  <div className="item">Add a Suggestion</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Employee Posts */}
      {employeePosts.map((post) => (
        <EmployeePost key={post.id} employee={post} goToProfile={() => {}} />
      ))}

      {/* Edit Profile Modal */}
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
                />
              </label>
              <label>
                Designation:
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
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

export default Page4;