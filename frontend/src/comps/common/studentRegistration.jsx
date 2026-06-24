import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./student.css";
import axios from "axios";

function StudentForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    admissionDate: "",
    status: "Admitted",
    tcIssued: "No",
    email: "",
    phone: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    studentClass: "",
    medium: "",
    aadhar_no: "",
    account_no: "",
    ifc_code: "",
  });

  useEffect(() => {
  const num = Math.floor(10000 + Math.random() * 90000);
  setFormData((prev) => ({
    ...prev,
    studentId: `STD${num}`,
  }));
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/students/register",
        formData
      );

      alert(`✅ Registered Successfully ID: ${formData.studentId}`);

      

    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("❌ Registration Failed");
    }
  };

  // ✅ Classes with Sections
  const classes = [
    "KG1", "KG2",
    "1st", "2nd", "3rd", "4th", "5th",
    "6th A", "6th B",
    "7th A", "7th B",
    "8th A", "8th B",
    "9th A", "9th B",
    "10th A", "10th B"
  ];

  return (
    <div className="main-container">
      <div className="form-container">

        <h2>Student Admission Form</h2>

        <form onSubmit={handleSubmit}>

          {/* Student ID */}
          <div className="form-group">
            <label>Student ID</label>
            <input type="text" value={formData.studentId} readOnly />
          </div>

          {/* Name */}
          <div className="form-group">
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          </div>

          {/* Gender */}
          <div className="form-group gender">
            <label>Gender:</label>
            <input type="radio" name="gender" value="Male" onChange={handleChange} required /> Male
            <input type="radio" name="gender" value="Female" onChange={handleChange} required /> Female
          </div>

          {/* Dates */}
          <div className="form-group">
            <label>Date of Birth</label>
            <input type="date" name="dob" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Admission Date</label>
            <input type="date" name="admissionDate" onChange={handleChange} required />
          </div>

          {/* Status */}
          <div className="form-group">
            <label>Status</label>
            <select name="status" onChange={handleChange}>
              <option value="Admitted">Admitted</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* TC */}
          <div className="form-group">
            <label>TC Issued</label>
            <select name="tcIssued" onChange={handleChange}>
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {/* Contact */}
          <div className="form-group">
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} required />
          </div>

          {/* Class Dropdown */}
          <div className="form-group">
            <select name="studentClass" onChange={handleChange} required>
              <option value="">Select Class</option>
              {classes.map((cls, index) => (
                <option key={index} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          {/* Medium */}
          <div className="form-group">
            <select name="medium" onChange={handleChange} required>
              <option value="">Select Medium</option>
              <option>Hindi</option>
              <option>English</option>
            </select>
          </div>

          {/* Address */}
          <div className="form-group">
            <textarea name="address" placeholder="Address" onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
            <input type="text" name="city" placeholder="City" onChange={handleChange} />
          </div>

          <div className="form-group">
            <input type="text" name="state" placeholder="State" onChange={handleChange} />
          </div>

          <div className="form-group">
            <input type="number" name="pincode" placeholder="Pincode" onChange={handleChange} />
          </div>

          {/* Govt/Bank */}
          <div className="form-group">
            <input type="text" name="aadhar_no" placeholder="Aadhar Number" onChange={handleChange} />
          </div>

          <div className="form-group">
            <input type="text" name="account_no" placeholder="Account Number" onChange={handleChange} />
          </div>

          <div className="form-group">
            <input type="text" name="ifc_code" placeholder="IFSC Code" onChange={handleChange} />
          </div>

          {/* Password */}
          <div className="form-group">
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>

          {/* Buttons */}
          <div className="form-group">
            <button type="submit">Register</button>
          </div>

          <div className="form-group">
            <button
              type="button"
              className="login-btn"
              onClick={() => navigate("/student-login")}
            >
              Login
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default StudentForm;