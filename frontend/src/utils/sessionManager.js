// 🔥 Session Manager - Check and manage 24-hour sessions

export const checkSessionExpiry = () => {
  const expiryTime = localStorage.getItem("tokenExpiry");
  
  if (!expiryTime) return false;
  
  const isExpired = Date.now() > parseInt(expiryTime);
  
  if (isExpired) {
    // Clear all session data
    clearSession();
    return false;
  }
  
  return true;
};

export const clearSession = () => {
  // Student session
  localStorage.removeItem("student");
  localStorage.removeItem("token");
  
  // Teacher session
  localStorage.removeItem("teacherName");
  localStorage.removeItem("teacherId");
  
  // Principal session
  localStorage.removeItem("principal");
  localStorage.removeItem("principalToken");
  
  // Common
  localStorage.removeItem("tokenExpiry");
};

export const isUserLoggedIn = () => {
  return checkSessionExpiry() && (
    localStorage.getItem("student") || 
    localStorage.getItem("teacherName") || 
    localStorage.getItem("principal")
  );
};

export const getTimeUntilExpiry = () => {
  const expiryTime = localStorage.getItem("tokenExpiry");
  if (!expiryTime) return 0;
  
  const remaining = parseInt(expiryTime) - Date.now();
  return remaining > 0 ? Math.round(remaining / 1000 / 60) : 0; // Return in minutes
};
