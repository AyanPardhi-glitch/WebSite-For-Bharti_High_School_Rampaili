import React, { useEffect, useState } from "react";
import axios from "axios";
import "./student.css";

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

function StudentAttendance() {
  const [attendance, setAttendance] = useState({
    percentage: 0,
    present: 0,
    absent: 0,
    total: 0,
    monthly: [],
  });

  // 🔥 Fetch attendance on component mount
  useEffect(() => {
    const savedStudent = JSON.parse(localStorage.getItem("student"));
    if (savedStudent?._id) {
      fetchAttendance(savedStudent._id);
    }
  }, []);

  const fetchAttendance = async (studentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/attendance/student/${studentId}`
      );

      setAttendance(res.data);
    } catch (err) {
      console.log("Attendance error:", err);
    }
  };

  // ===== PIE DATA =====
  const pieData = [
    { name: "Present", value: attendance.present },
    { name: "Absent", value: attendance.absent },
  ];

  const COLORS = ["#4CAF50", "#F44336"];

  // ===== PERCENTAGE COLOR =====
  const getColor = () => {
    if (attendance.percentage >= 75) return "green";
    if (attendance.percentage >= 50) return "orange";
    return "red";
  };

  return (
    <div className="attendance-container">

      {/* TOP CARD */}
      <div className="attendance-card">
        <h2>Attendance Overview</h2>

        <div className="attendance-stats">
          <div>
            <h3 style={{ color: getColor() }}>
              {attendance.percentage}%
            </h3>
            <p>Overall Attendance</p>
          </div>

          <div>
            <p>Present: {attendance.present}</p>
            <p>Absent: {attendance.absent}</p>
            <p>Total: {attendance.total}</p>
          </div>
        </div>

        {/* PIE CHART */}
        <PieChart width={250} height={250}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* MONTHLY BAR CHART */}
      <div className="attendance-card">
        <h3>Monthly Report</h3>

        {attendance.monthly?.length > 0 ? (
          <BarChart width={500} height={300} data={attendance.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="present" fill="#4CAF50" />
          </BarChart>
        ) : (
          <p>No data found</p>
        )}
      </div>

    </div>
  );
}

export default StudentAttendance;
