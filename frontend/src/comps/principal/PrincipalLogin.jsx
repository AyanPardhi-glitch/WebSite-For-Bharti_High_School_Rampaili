import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PrincipalLogin() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 Dummy login
    if (
      loginData.email === "pardhiayan646@gmail.com" &&
      loginData.password === "123456"
    ) {
      alert("Login Successful ✅");
      
      // 🔥 Save session with 24-hour expiry
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      localStorage.setItem("principal", JSON.stringify({ email: loginData.email }));
      localStorage.setItem("principalToken", "authenticated");
      localStorage.setItem("tokenExpiry", expiryTime);
      
      navigate("/dashboard");
    } else {
      alert("Invalid Email or Password ❌");
    }
  };

  return (
    <div className="container">
      <h2>Principal Login</h2>

      <form onSubmit={handleSubmit}>
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

export default PrincipalLogin;