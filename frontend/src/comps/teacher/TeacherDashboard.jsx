import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import MyClasses from "./MyClasses.jsx";
import Attendance from "./Attendance.jsx";
import Assignments from "./Assignments.jsx";
import TeacherResults from "./TeacherResult.jsx";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import "./teacherDashboard.css";

const socket = io("http://localhost:5000");

function TeacherDashboard() {
  const [page, setPage] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    avgAttendance: 0,
    myClasses: [],
    periodData: [],
    recentAssignments: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const teacherName = localStorage.getItem("teacherName") || "";

  // 🔥 Refresh dashboard when page changes or refreshKey updates
  useEffect(() => {
    fetchDashboardData();
    
    // 🔥 Listen for new assignments
    socket.on("assignment_added", () => {
      console.log("📢 New assignment detected! Refreshing...");
      setRefreshKey(prev => prev + 1);
    });
    
    return () => {
      socket.off("assignment_added");
      socket.off("load_all_timetables");
    };
  }, [page, refreshKey]);
  
  // 🔥 Manual refresh function
  const handleRefresh = () => {
    console.log("🔄 Refreshing dashboard...");
    setRefreshKey(prev => prev + 1);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const handleTimetables = async (timetables) => {
        let classesAssigned = [];
        let periodCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

        // Find all classes for this teacher
        Object.keys(timetables).forEach((className) => {
          const classData = timetables[className] || {};
          const hasTeacher = Object.values(classData).some(
            (cell) => cell?.teacher?.toLowerCase().trim() === teacherName.toLowerCase().trim()
          );

          if (hasTeacher) {
            classesAssigned.push(className);
            // Count periods
            Object.entries(classData).forEach(([key, cell]) => {
              if (cell?.teacher?.toLowerCase().trim() === teacherName.toLowerCase().trim()) {
                const period = parseInt(key.split("-")[1]);
                if (period) periodCount[period]++;
              }
            });
          }
        });

        console.log("🔍 Teacher Name:", teacherName);
        console.log("📋 Classes Assigned:", classesAssigned);

        // Get ALL students in school (not filtered by teacher's classes)
        let totalStudents = 0;
        try {
          const res = await axios.get("http://localhost:5000/students/dashboard");
          console.log("📚 All Students Response:", res.data);
          totalStudents = res.data?.totalStudents || 0;
          console.log("📊 Total Students in School:", totalStudents);
        } catch (err) {
          console.log("❌ Error fetching all students:", err.message, err.response?.data);
        }

        // Get assignments
        let totalAssignments = 0;
        let recentAssignments = [];
        for (let cls of classesAssigned) {
          try {
            const res = await axios.get(`http://localhost:5000/students/assignment/${encodeURIComponent(cls)}`);
            const assignments = res.data?.data || [];
            console.log(`📝 Assignments in ${cls}:`, assignments.length);
            totalAssignments += assignments.length;
            recentAssignments.push(...assignments.slice(0, 3));
          } catch (err) {
            console.log("Error fetching assignments:", err.message);
          }
        }
        console.log("📊 Total Assignments:", totalAssignments);

        // Calculate average attendance
        let avgAttendance = 0;
        try {
          const res = await axios.get("http://localhost:5000/attendance/all-classes");
          const attendanceData = res.data || [];
          console.log("📋 All Attendance Records:", attendanceData);
          const classAttendance = attendanceData.filter((att) =>
            classesAssigned.includes(att.className)
          );
          console.log("📊 Filtered Attendance:", classAttendance);

          if (classAttendance.length > 0) {
            let totalAttendance = 0;
            let recordCount = 0;
            classAttendance.forEach((att) => {
              const present = att.present || 0;
              const total = att.total || 0;
              if (total > 0) {
                totalAttendance += (present / total) * 100;
                recordCount++;
              }
            });
            avgAttendance = recordCount > 0 ? Math.round(totalAttendance / recordCount) : 0;
          }
          console.log("📊 Average Attendance:", avgAttendance);
        } catch (err) {
          console.log("Error fetching attendance:", err.message);
        }

        // Format period data for chart
        const periodData = [
          { period: "Period 1", classes: periodCount[1] || 0 },
          { period: "Period 2", classes: periodCount[2] || 0 },
          { period: "Period 3", classes: periodCount[3] || 0 },
          { period: "Period 4", classes: periodCount[4] || 0 },
          { period: "Period 5", classes: periodCount[5] || 0 },
          { period: "Period 6", classes: periodCount[6] || 0 },
        ].filter(item => item.classes > 0);

        setDashboardData({
          totalClasses: classesAssigned.length,
          totalStudents,
          totalAssignments,
          avgAttendance,
          myClasses: classesAssigned,
          periodData: periodData.length > 0 ? periodData : [{ period: "No Classes", classes: 0 }],
          recentAssignments: recentAssignments.slice(0, 5)
        });

        setLoading(false);
      };

      socket.off("load_all_timetables");
      socket.on("load_all_timetables", handleTimetables);
      socket.emit("get_all_timetables");

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  const COLORS = ["#3498db", "#2ecc71", "#f39c12", "#e74c3c", "#9b59b6", "#1abc9c"];

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>📘 Teacher Panel</h2>
        <p style={{ fontSize: "12px", color: "#bbb", marginBottom: "20px" }}>👨‍🏫 {teacherName}</p>

        <ul>
          <li
            onClick={() => setPage("dashboard")}
            className={page === "dashboard" ? "active" : ""}
          >
            🏠 Dashboard
          </li>
          <li
            onClick={() => setPage("classes")}
            className={page === "classes" ? "active" : ""}
          >
            📚 My Classes
          </li>
          <li
            onClick={() => setPage("attendance")}
            className={page === "attendance" ? "active" : ""}
          >
            📝 Attendance
          </li>
          <li
            onClick={() => setPage("assignments")}
            className={page === "assignments" ? "active" : ""}
          >
            📄 Assignments
          </li>
          <li
            onClick={() => setPage("results")}
            className={page === "results" ? "active" : ""}
          >
            📊 Results
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="main">
        {/* Dashboard Home */}
        {page === "dashboard" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
              <h1 style={{ color: "#1e2a47", margin: 0 }}>📊 Dashboard Overview</h1>
              <button 
                onClick={handleRefresh}
                style={{
                  padding: "10px 20px",
                  background: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}
              >
                🔄 Refresh
              </button>
            </div>

            {/* Stats Cards */}
            <div className="cards">
              <div className="card blue">
                <div className="card-icon">📚</div>
                <h3>Classes Assigned</h3>
                <p>{dashboardData.totalClasses}</p>
              </div>

              <div className="card green">
                <div className="card-icon">👥</div>
                <h3>Total Students</h3>
                <p>{dashboardData.totalStudents}</p>
              </div>

              <div className="card orange">
                <div className="card-icon">📝</div>
                <h3>Assignments</h3>
                <p>{dashboardData.totalAssignments}</p>
              </div>

              <div className="card purple">
                <div className="card-icon">✅</div>
                <h3>Avg Attendance %</h3>
                <p>{dashboardData.avgAttendance}%</p>
              </div>
            </div>

            {/* Charts Section */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px" }}>
              {/* Period Distribution Chart */}
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ color: "#1e2a47", marginBottom: "15px" }}>📊 Classes by Period</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.periodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="classes" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Class Distribution Pie Chart */}
              <div
                style={{
                  background: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ color: "#1e2a47", marginBottom: "15px" }}>🎯 My Classes</h3>
                {dashboardData.myClasses.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    {dashboardData.myClasses.map((cls, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px 20px",
                          background: COLORS[idx % COLORS.length],
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {cls}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "#999" }}>No classes assigned</p>
                )}
              </div>
            </div>

            {/* Recent Assignments */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                marginTop: "20px",
              }}
            >
              <h3 style={{ color: "#1e2a47", marginBottom: "15px" }}>📝 Recent Assignments</h3>
              {dashboardData.recentAssignments.length > 0 ? (
                <div>
                  {dashboardData.recentAssignments.map((assignment, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "15px",
                        borderLeft: "4px solid #3498db",
                        background: "#f9f9f9",
                        marginBottom: "10px",
                        borderRadius: "5px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontWeight: "bold", color: "#1e2a47" }}>
                            {assignment.subject && assignment.className ? (
                              `${assignment.subject} - ${assignment.className}`
                            ) : (
                              assignment.className || "Unknown Class"
                            )}
                          </p>
                          <p style={{ color: "#666", fontSize: "13px", marginTop: "5px" }}>
                            {assignment.text ? assignment.text.substring(0, 60) : "No description"}...
                          </p>
                        </div>
                        <span style={{ fontSize: "12px", color: "#999" }}>
                          {assignment.date ? new Date(assignment.date).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#999" }}>No assignments yet</p>
              )}
            </div>

            {/* Quick Actions */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "15px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setPage("classes")}
                style={{
                  padding: "15px",
                  background: "#3498db",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#2980b9")}
                onMouseLeave={(e) => (e.target.style.background = "#3498db")}
              >
                📚 View My Classes
              </button>

              <button
                onClick={() => setPage("attendance")}
                style={{
                  padding: "15px",
                  background: "#2ecc71",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#27ae60")}
                onMouseLeave={(e) => (e.target.style.background = "#2ecc71")}
              >
                📝 Mark Attendance
              </button>

              <button
                onClick={() => setPage("assignments")}
                style={{
                  padding: "15px",
                  background: "#f39c12",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#e67e22")}
                onMouseLeave={(e) => (e.target.style.background = "#f39c12")}
              >
                📄 Post Assignment
              </button>

              <button
                onClick={() => setPage("results")}
                style={{
                  padding: "15px",
                  background: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "14px",
                  transition: "0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#c0392b")}
                onMouseLeave={(e) => (e.target.style.background = "#e74c3c")}
              >
                📊 Post Results
              </button>
            </div>
          </div>
        )}

        {page === "classes" && <MyClasses />}
        {page === "attendance" && <Attendance />}
        {page === "assignments" && <Assignments />}
        {page === "results" && <TeacherResults />}
      </div>
    </div>
  );
}

export default TeacherDashboard;