import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./studentLogin.css";

function StudentLogin() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/students/login",
        loginData
      );

      console.log("LOGIN RESPONSE 👉", res.data); // 🔥 DEBUG

      if (res.data.status === true) {
        alert("Login Successful ✅");

        // 🔥 Save data with 24-hour expiry
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        localStorage.setItem("student", JSON.stringify(res.data.student));
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("tokenExpiry", expiryTime);

        // 🔥 Redirect
        navigate("/student-dashboard");
      } else {
        alert(res.data.message);
      }
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Server Error ❌");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>Student Login</h2>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default StudentLogin;