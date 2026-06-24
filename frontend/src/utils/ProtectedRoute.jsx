import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { checkSessionExpiry, clearSession } from "./sessionManager";

// 🔥 Protected Route Component
const ProtectedRoute = ({ children, userType = "student" }) => {
  useEffect(() => {
    // Check session every second
    const sessionCheck = setInterval(() => {
      if (!checkSessionExpiry()) {
        alert("Session expired. Please login again.");
        clearSession();
        window.location.href = userType === "student" ? "/student-login" : userType === "teacher" ? "/teacher-login" : "/principal-login";
      }
    }, 1000);

    return () => clearInterval(sessionCheck);
  }, [userType]);

  // Check initial session
  if (!checkSessionExpiry()) {
    return <Navigate to={userType === "student" ? "/student-login" : userType === "teacher" ? "/teacher-login" : "/principal-login"} />;
  }

  return children;
};

export default ProtectedRoute;
