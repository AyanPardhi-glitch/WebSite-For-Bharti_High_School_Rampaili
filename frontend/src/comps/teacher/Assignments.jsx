import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./teacherDashboard.css";

const socket = io("http://localhost:5000");

function Assignments() {

  const teacherName = localStorage.getItem("teacherName") || "";
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [assignment, setAssignment] = useState("");
  const [assignmentsList, setAssignmentsList] = useState([]);
  const [message, setMessage] = useState("");

  // ================= LOAD CLASSES ASSIGNED TO TEACHER =================
  useEffect(() => {
    const handleTimetables = (timetables) => {
      if (!teacherName) return;

      const assigned = Object.keys(timetables || {}).filter((className) => {
        const classData = timetables[className] || {};
        return Object.values(classData).some(
          (cell) => cell?.teacher?.toLowerCase().trim() === teacherName.toLowerCase().trim()
        );
      });

      setClasses(assigned);
      if (!assigned.includes(selectedClass)) {
        setSelectedClass("");
        setSubjects([]);
        setAssignmentsList([]);
      }
    };

    const handleUpdate = () => {
      socket.emit("get_all_timetables");
    };

    socket.on("load_all_timetables", handleTimetables);
    socket.on("update_timetable", handleUpdate);

    socket.emit("get_all_timetables");

    return () => {
      socket.off("load_all_timetables", handleTimetables);
      socket.off("update_timetable", handleUpdate);
    };
  }, [teacherName, selectedClass]);

  // ================= CLASS CHANGE =================
  const handleClassChange = async (cls) => {
    setSelectedClass(cls);
    setSelectedSubject("");
    setAssignment("");

    // GET ASSIGNMENTS (FIXED ROUTE)
    try {
      const res = await axios.get(
        `http://localhost:5000/students/assignment/${cls}`
      );

      if (res.data.status) {
        setAssignmentsList(res.data.data);
      } else {
        setAssignmentsList([]);
      }
    } catch (err) {
      console.log(err.message);
    }

    // GET SUBJECTS FROM TEACHER API (FILTERED BY TEACHER)
    try {
      const res = await axios.get(
        `http://localhost:5000/teachers/subjects/${encodeURIComponent(cls)}?teacherName=${encodeURIComponent(teacherName)}`
      );

      setSubjects(res.data || []);

    } catch (err) {
      console.log(err.message);
    }
  };

  // ================= ADD ASSIGNMENT =================
  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject || !assignment) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/teachers/assignment/add",
        {
          className: selectedClass,
          subject: selectedSubject,
          text: assignment,
        }
      );

      if (res.data.status) {
        setAssignmentsList([res.data.data, ...assignmentsList]);
        setAssignment("");
        setMessage("Assignment Added ✅");
        
        // 🔥 Emit socket event to refresh dashboard
        socket.emit("assignment_added", { 
          className: selectedClass, 
          subject: selectedSubject 
        });

        setTimeout(() => setMessage(""), 3000);
      }

    } catch (err) {
      console.log(err.message);
    }
  };

  // 🔥 Refresh assignments list
  const handleRefresh = async () => {
    if (!selectedClass) {
      alert("Select class first");
      return;
    }
    
    try {
      const res = await axios.get(
        `http://localhost:5000/students/assignment/${selectedClass}`
      );

      if (res.data.status) {
        setAssignmentsList(res.data.data);
        setMessage("Assignments refreshed ✅");
        setTimeout(() => setMessage(""), 2000);
      }
    } catch (err) {
      console.log("Refresh error:", err.message);
    }
  };

  return (
    <div className="assignments">

      <h2>📄 Assignments</h2>

      {/* CLASS */}
      <select onChange={(e) => handleClassChange(e.target.value)}>
        <option value="">Select Class</option>
        {classes.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>

      {/* SUBJECT */}
      {selectedClass && (
        <select onChange={(e) => setSelectedSubject(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      )}

      {/* INPUT */}
      {selectedSubject && (
        <>
          <input
            value={assignment}
            onChange={(e) => setAssignment(e.target.value)}
            placeholder="Enter Assignment"
          />

          <button onClick={handleSubmit}>
            Add Assignment
          </button>
        </>
      )}

      {/* MESSAGE */}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* REFRESH BUTTON */}
      {selectedClass && (
        <button 
          onClick={handleRefresh}
          style={{
            padding: "8px 15px",
            background: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "15px"
          }}
        >
          🔄 Refresh List
        </button>
      )}

      {/* LIST */}
      <div style={{ marginTop: "20px" }}>
        <h3>📋 Assignments for {selectedClass}</h3>
        {assignmentsList.length > 0 ? (
          assignmentsList.map((a, i) => (
            <div key={i} style={{ 
              padding: "15px", 
              border: "1px solid #ddd", 
              borderRadius: "5px", 
              marginBottom: "10px",
              background: "#f9f9f9"
            }}>
              <p><strong>Class:</strong> {a.className}</p>
              <p><strong>Subject:</strong> {a.subject}</p>
              <p><strong>Assignment:</strong> {a.text}</p>
              <p style={{ fontSize: "12px", color: "#999" }}>
                <strong>Date:</strong> {a.date ? new Date(a.date).toLocaleDateString() : "N/A"}
              </p>
            </div>
          ))
        ) : (
          <p style={{ color: "#999" }}>No assignments yet. Select a class to see assignments.</p>
        )}
      </div>

    </div>
  );
}

export default Assignments;