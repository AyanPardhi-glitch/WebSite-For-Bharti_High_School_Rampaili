import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./teacherForm.css";

function TeacherRegistration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    fatherName: "",
    motherName: "",
    mobile: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    qualification: "",
    experience: "",
    account: "",
    ifsc: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !formData.name ||
        !formData.email ||
        !formData.mobile ||
        !formData.fatherName ||
        !formData.password
      ) {
  alert("Please fill all required fields ❗");
  return;
}

    try {
      const res = await axios.post(
        "http://localhost:5000/teachers/register",
        formData
      );

      alert("Teacher Registered Successfully ✅");
      console.log(res.data);

      setFormData({
        id: "",
        name: "",
        fatherName: "",
        motherName: "",
        mobile: "",
        email: "",
        password: "",
        address: "",
        gender: "",
        qualification: "",
        experience: "",
        account: "",
        ifsc: "",
      });

      navigate("/teacher-login");

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error ❌");
    }
  };

  const handleReset = () => {
    setFormData({
      id: "",
      name: "",
      fatherName: "",
      motherName: "",
      mobile: "",
      email: "",
      password: "",
      address: "",
      gender: "",
      qualification: "",
      experience: "",
      account: "",
      ifsc: "",
    });
  };

  return (
    <div className="teacher-form-container">
      <form className="teacher-form" onSubmit={handleSubmit}>
        <h1>Teacher Registration</h1>

        <div>
          <label>ID:</label>
          <input type="text" name="id" value={formData.id} onChange={handleChange} />
        </div>

        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div>
          <label>Father Name:</label>
          <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} />
        </div>

        <div>
          <label>Mother Name:</label>
          <input type="text" name="motherName" value={formData.motherName} onChange={handleChange} />
        </div>

        <div>
          <label>Mobile:</label>
          <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        <div>
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
        </div>

        <div>
          <label>Gender:</label>
          <label>
            <input type="radio" name="gender" value="Male"
              checked={formData.gender === "Male"}
              onChange={handleChange} /> Male
          </label>
          <label>
            <input type="radio" name="gender" value="Female"
              checked={formData.gender === "Female"}
              onChange={handleChange} /> Female
          </label>
        </div>

        <div>
          <label>Qualification:</label>
          <select name="qualification" value={formData.qualification} onChange={handleChange}>
            <option value="">Select</option>
            <option>12th</option>
            <option>BSc</option>
            <option>MSc</option>
            <option>BCA</option>
            <option>MCA</option>
            <option>B.Ed</option>
            <option>M.Ed</option>
            <option>PhD</option>
          </select>
        </div>

        <div>
          <label>Experience:</label>
          <select name="experience" value={formData.experience} onChange={handleChange}>
            <option value="">Select</option>
            <option value="0-1">0-1</option>
            <option value="1-3">1-3</option>
            <option value="3-5">3-5</option>
            <option value="5-10">5-10</option>
          </select>
        </div>

        <div>
          <label>Account No:</label>
          <input type="text" name="account" value={formData.account} onChange={handleChange} />
        </div>

        <div>
          <label>IFSC Code:</label>
          <input type="text" name="ifsc" value={formData.ifsc} onChange={handleChange} />
        </div>

        {/* Buttons */}
        <div className="btn-group">
          <button type="submit">Register</button>
          <button type="button" onClick={handleReset}>Clear</button>
          <button type="button" onClick={() => navigate("/teacher-login")}>
            Login
          </button>
        </div>

      </form>
    </div>
  );
}

export default TeacherRegistration;