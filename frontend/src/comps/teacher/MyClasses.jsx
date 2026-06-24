import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./teacherDashboard.css";

const socket = io("http://localhost:5000");

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function MyClasses() {

  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const teacherName = localStorage.getItem("teacherName") || "";

  useEffect(() => {

    const handleLoad = (data) => {
      console.log("📥 LOAD:", data);
      setTimetable(data || {});
      setLoading(false);
    };

    const handleUpdate = (data) => {
      console.log("🔄 UPDATE:", data);
      setTimetable(data || {});
    };

    socket.off("load_all_timetables", handleLoad);
    socket.off("update_timetable", handleUpdate);

    socket.on("load_all_timetables", handleLoad);
    socket.on("update_timetable", handleUpdate);

    socket.emit("get_all_timetables");

    return () => {
      socket.off("load_all_timetables", handleLoad);
      socket.off("update_timetable", handleUpdate);
    };

  }, []);

  // ✅ FILTER + SORT
  const rows = [];

  Object.keys(timetable).forEach((className) => {
    const classData = timetable[className] || {};

    days.forEach((day) => {
      for (let p = 1; p <= 6; p++) {

        const key = `${day}-${p}`;
        const cell = classData[key];

        if (
          cell &&
          typeof cell === "object" &&
          cell.teacher &&
          teacherName &&
          cell.teacher.toLowerCase().trim() === teacherName.toLowerCase().trim()
        ) {
          rows.push({
            class: className,
            subject: cell.subject || "-",
            day,
            period: p,
          });
        }
      }
    });
  });

  // ✅ SORT
  rows.sort((a, b) => {
    const dayOrder = days.indexOf(a.day) - days.indexOf(b.day);
    if (dayOrder !== 0) return dayOrder;
    return a.period - b.period;
  });

  const COLORS = ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#f5576c", "#764ba2"];

  if (loading) {
    return (
      <div style={{ padding: "20px", marginTop: "40px", textAlign: "center" }}>
        <p>⏳ Loading classes...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", marginTop: "0" }}>
      <h1 style={{ color: "#1e2a47", marginBottom: "10px" }}>📘 My Classes</h1>
      <p style={{ color: "#666", marginBottom: "25px" }}>👨‍🏫 {teacherName}</p>

      {rows.length === 0 ? (
        <div
          style={{
            background: "#e3f2fd",
            borderLeft: "4px solid #3498db",
            padding: "20px",
            borderRadius: "8px",
            color: "#1976d2",
            marginTop: "20px",
          }}
        >
          📋 No classes assigned yet
        </div>
      ) : (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {rows.map((r, i) => (
              <div
                key={i}
                style={{
                  padding: "20px",
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  borderTop: `4px solid ${COLORS[i % COLORS.length]}`,
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <div
                    style={{
                      background: COLORS[i % COLORS.length],
                      color: "white",
                      padding: "8px 15px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Period {r.period}
                  </div>
                  <span style={{ color: "#999", fontSize: "12px" }}>📅 {r.day}</span>
                </div>

                <h3 style={{ color: "#1e2a47", marginBottom: "8px", fontSize: "16px" }}>
                  {r.subject}
                </h3>

                <p style={{ color: "#666", fontSize: "14px", marginBottom: "10px" }}>
                  📚 {r.class}
                </p>

                <div
                  style={{
                    background: "#f9f9f9",
                    padding: "12px",
                    borderRadius: "8px",
                    marginTop: "12px",
                    fontSize: "13px",
                    color: "#666",
                    borderLeft: "3px solid " + COLORS[i % COLORS.length],
                  }}
                >
                  <strong>Schedule:</strong>
                  <br />
                  {r.day} - Period {r.period}
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "30px",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #667eea",
              }}
            >
              <p style={{ color: "#666", fontSize: "13px", marginBottom: "8px" }}>Total Classes</p>
              <p style={{ fontSize: "28px", fontWeight: "bold", color: "#1e2a47" }}>
                {rows.length}
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #f093fb",
              }}
            >
              <p style={{ color: "#666", fontSize: "13px", marginBottom: "8px" }}>Unique Classes</p>
              <p style={{ fontSize: "28px", fontWeight: "bold", color: "#1e2a47" }}>
                {new Set(rows.map((r) => r.class)).size}
              </p>
            </div>

            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderLeft: "4px solid #4facfe",
              }}
            >
              <p style={{ color: "#666", fontSize: "13px", marginBottom: "8px" }}>Unique Subjects</p>
              <p style={{ fontSize: "28px", fontWeight: "bold", color: "#1e2a47" }}>
                {new Set(rows.map((r) => r.subject)).size}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyClasses;