import React, { useState, useEffect } from "react";
import axios from "axios";
import "./dashboard.css";

import AssignSubject from "./AssignSubject";
import ViewAllTimetable from "./ViewAllTimetable";
import ViewTeachers from "./ViewTeachers";
import ViewStudent from "./ViewStudent";
import ViewAttendance from "./ViewAttendance";
import GenerateResult from "./GenerateResult";

// Charts
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// Icons
import { FaChalkboard, FaUserGraduate, FaUserTie } from "react-icons/fa";

function PrincipalDashboard() {

  const [page, setPage] = useState("Dashboard");

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [classData, setClassData] = useState({});

  const [notices, setNotices] = useState([]);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    fetchDashboard();

    setNotices([
      { id: 1, text: "School closed tomorrow", date: "21 Apr 2026" },
      { id: 2, text: "Submit reports before Friday", date: "20 Apr 2026" },
      { id: 3, text: "PTM meeting on Monday", date: "18 Apr 2026" }
    ]);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:5000/students/dashboard");

      setTotalStudents(res.data?.totalStudents || 0);
      setClassData(res.data?.classCount || {});

      const teacherRes = await axios.get("http://localhost:5000/teachers/count");
      setTotalTeachers(teacherRes.data?.totalTeachers || 0);

    } catch {
      setTotalStudents(0);
      setTotalTeachers(0);
      setClassData({});
    }
  };

  const formatClassName = (name) =>
    name?.toString().replace(/\b\w/g, (c) => c.toUpperCase());

  const chartData = Object.entries(classData || {}).map(([cls, count]) => ({
    name: formatClassName(cls),
    value: count
  }));

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>PRINCIPAL</h2>
        <ul>
          <li onClick={() => setPage("Dashboard")}>🏠 Dashboard</li>
          <li onClick={() => setPage("Timetable")}>📅 Timetable</li>
          <li onClick={() => setPage("Teachers")}>👨‍🏫 Teachers</li>
          <li onClick={() => setPage("Students")}>🎓 Students</li>
          <li onClick={() => setPage("Attendance")}>📊 Attendance</li>
          <li onClick={() => setPage("GenerateResult")}>📝 Generate Result</li>
          <li onClick={() => setPage("AllTimetables")}>📋 All Timetables</li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* NAVBAR */}
        <div className="navbar">
          <h2>Principal Dashboard</h2>

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

        {/* DASHBOARD */}
        {page === "Dashboard" && (
          <>

            {/* TOP CARDS */}
            <div className="cards">

              <div className="top-card">
                <div className="card-icon"><FaChalkboard /></div>
                <h2>{Object.keys(classData || {}).length}</h2>
                <p>Classes</p>
              </div>

              <div className="top-card">
                <div className="card-icon"><FaUserTie /></div>
                <h2>{totalTeachers}</h2>
                <p>Teachers</p>
              </div>

              <div className="top-card">
                <div className="card-icon"><FaUserGraduate /></div>
                <h2>{totalStudents}</h2>
                <p>Students</p>
              </div>

            </div>

            {/* CLASS DATA */}
            <h2 className="heading">Class Wise Students</h2>

            <div className="cards">
              {Object.entries(classData).map(([cls, count]) => (
                <div className="class-card" key={cls}>
                  <h3>{formatClassName(cls)}</h3>
                  <p>{count} Students</p>
                </div>
              ))}
            </div>

            {/* CHARTS */}
            <div className="cards">

              <div className="chart-container">
                <h3>Class Distribution</h3>
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
                <h3>Students Graph</h3>
                <BarChart width={400} height={300} data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb" />
                </BarChart>
              </div>

            </div>

          </>
        )}

        {page === "Timetable" && <AssignSubject />}
        {page === "Teachers" && <ViewTeachers />}
        {page === "Students" && <ViewStudent />}
        {page === "Attendance" && <ViewAttendance />}
        {page === "AllTimetables" && <ViewAllTimetable />}
        {page === "GenerateResult" && <GenerateResult />}
      </div>
    </div>
  );
}

export default PrincipalDashboard;