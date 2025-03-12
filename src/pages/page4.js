import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeePost from "../components/EmployeePost";
import { employees } from "../data/employees";
import { FaArrowLeft } from "react-icons/fa";
import "./page4.css";

const Page4 = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employeePosts, setEmployeePosts] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    // Update employee details here (e.g., API call or state update)
    setEmployeeDetails({
      ...employeeDetails,
      ...formData,
    });
    setIsModalOpen(false);
  };

  if (!employeeDetails) {
    return <div>Employee not found.</div>;
  }

  return (
    <div className="page4-container">
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-header">
          <FaArrowLeft className="back-arrow" onClick={() => navigate(-1)} />
          <div className="profile-info">
            <img src={employeeDetails.profilePic} alt="Profile" className="profile-pic" />
            <div className="profile-details">
              <h2 className="profile-name">{employeeDetails.name}</h2>
              <p className="profile-designation">{employeeDetails.designation}</p>
              <p className="profile-industry">@{employeeDetails.username}</p>
              <p className="profile-bio">{employeeDetails.bio}</p>
              <div className="profile-stats">
                <button className="edit-profile-btn" onClick={() => setIsModalOpen(true)}>
                  Edit Profile
                </button>
                <div className="stats">
                  <span className="followers">{employeeDetails.followers} Followers</span>
                  <span className="experts">{employeeDetails.experts} Experts</span>
                </div>
              </div>
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
        <div className="modal-overlay">
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
              <div className="modal-buttons">
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