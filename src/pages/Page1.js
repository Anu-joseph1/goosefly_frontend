import React from "react";
import { useNavigate } from "react-router-dom";
import "./page1.css";
import EmployeePost from "../components/EmployeePost"; // Correct import path
import { employees } from "../data/employees"; // Assuming you move the employees data to a separate file

const Page1 = ({ isOpen }) => {
  const navigate = useNavigate();

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <div className="page1-container">
      {employees.map((employee) => (
        <EmployeePost key={employee.id} employee={employee} goToProfile={goToProfile} />
      ))}
    </div>
  );
};

export default Page1;