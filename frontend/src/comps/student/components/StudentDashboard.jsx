import React, { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";
import { Link } from "react-router-dom";   // 🔥 IMPORTANT

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

import { FaUserGraduate, FaCalendarCheck } from "react-icons/fa";

function StudentDashboard() {

  const [student, setStudent] = useState({});
  const [attendance, setAttendance] = useState(0);
  const [subjects, setSubjects] = useState([]);

  const [notices, setNotices] = useState([]);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const savedStudent = JSON.parse(localStorage.getItem("student"));

    if (savedStudent?._id) {
      setStudent(savedStudent);
      fetchData(savedStudent);
    }

    setNotices([
      { id: 1, text: "Exam from next week", date: "21 Apr 2026" },
      { id: 2, text: "Submit assignment", date: "20 Apr 2026" }
    ]);

  }, []);

  const fetchData = async (savedStudent) => {
    try {
      if (!savedStudent) return;

      const res = await axios.get(
        `http://localhost:5000/students/${savedStudent._id}`
      );
      setStudent(res.data);

      const att = await axios.get(
        `http://localhost:5000/attendance/student/${savedStudent._id}`
      );
      setAttendance(att.data?.percentage || 0);

      const sub = await axios.get(
        `http://localhost:5000/students/subjects/${savedStudent._id}`
      );
      setSubjects(sub.data || []);

    } catch (err) {
      console.log(err);
      setAttendance(0);
      setSubjects([]);
    }
  };

  const chartData = subjects.map((s) => ({
    name: s.name,
    value: s.marks || 0
  }));

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="dashboard">

      {/* 🔥 SIDEBAR WITH LINKS */}
      <div className="sidebar">
        <h2>STUDENT</h2>
        <p style={{ fontSize: "12px", color: "#bbb", marginBottom: "20px" }}>
          {student?.firstName
            ? `${student.firstName} ${student.lastName}`
            : "Logged in student"}
        </p>

        <ul>
          <li><Link to="/student-dashboard">🏠 Dashboard</Link></li>
          <li><Link to="/student-profile">👤 Profile</Link></li>
          <li><Link to="/student-attendance">📊 Attendance</Link></li>
          <li><Link to="/student-results">📝 Results</Link></li>
          <li><Link to="/student-assignments">📄 Assignments</Link></li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* NAVBAR */}
        <div className="navbar">
          <h2>Student Dashboard</h2>

          <div className="notice-icon" onClick={() => setShowNotice(!showNotice)}>
            🔔
            {notices.length > 0 && <span className="badge">{notices.length}</span>}

            {showNotice && (
              <div className="notice-dropdown">
                {notices.map((n) => (
                  <div key={n.id} className="notice-item">
                    <p>{n.text}</p>
                    <span>{n.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="cards">
          <div className="top-card">
            <div className="card-icon"><FaUserGraduate /></div>
            <h2>
              {student?.firstName
                ? student.firstName + " " + student.lastName
                : "Loading..."}
            </h2>
          </div>

          <div className="top-card">
            <div className="card-icon"><FaCalendarCheck /></div>
            <h2>{attendance}%</h2>
            <p>Attendance</p>
          </div>
        </div>

        {/* SUBJECT SECTION */}
        <h2 style={{ marginBottom: "10px" }}>Your Subjects</h2>

        <div className="subject-wrapper">

          <div className="big-card">
            <h3>Subjects</h3>
            <div className="mini-container">
              {subjects.map((s, i) => (
                <div className="mini-card" key={i}>
                  {s.name}
                </div>
              ))}
            </div>
          </div>

          <div className="big-card">
            <h3>Marks</h3>
            <div className="mini-container">
              {subjects.map((s, i) => (
                <div className="mini-card" key={i}>
                  {s.name} - {s.marks}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* CHARTS */}
        <div className="cards">
          <div className="chart-container">
            <h3>Marks Distribution</h3>
            <PieChart width={300} height={300}>
              <Pie data={chartData} dataKey="value" outerRadius={100} label>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="chart-container">
            <h3>Marks Graph</h3>
            <BarChart width={400} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;