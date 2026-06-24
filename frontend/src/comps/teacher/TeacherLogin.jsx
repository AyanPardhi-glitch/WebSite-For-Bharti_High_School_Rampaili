import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./teacherForm.css";

function TeacherLogin() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // ✅ Handle Input
  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      alert("Please fill all fields ❗");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/teachers/login",
        loginData
      );

      console.log("LOGIN RESPONSE 👉", res.data);

      // ✅ 🔥 YAHI ADD KIYA HAI (IMPORTANT)
      if (res.data.status) {
        // 🔥 Save data with 24-hour expiry
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        localStorage.setItem("teacherName", res.data.data.name);
        localStorage.setItem("teacherId", res.data.data._id);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("tokenExpiry", expiryTime);

        alert("Login Successful ✅");

        // 👉 Redirect
        navigate("/teacher-dashboard");
      } else {
        alert(res.data.message);
      }

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid Credentials ❌");
    }
  };

  return (
    <div className="teacher-form-container">
      <form className="teacher-form" onSubmit={handleLogin}>
        <h1>Teacher Login</h1>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />
        </div>

        {/* Buttons */}
        <div className="btn-group">
          <button type="submit">Login</button>

          <button
            type="button"
            onClick={() => navigate("/teacher-form")}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeacherLogin;