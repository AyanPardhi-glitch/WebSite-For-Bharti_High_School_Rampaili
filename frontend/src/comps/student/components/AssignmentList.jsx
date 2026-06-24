import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentAssignments() {

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));

    console.log("Student Data:", student);

    // ✅ FIX: use studentClass (NOT className)
    if (!student || !student.studentClass) {
      setLoading(false);
      return;
    }

    console.log("Fetching for class:", student.studentClass);

    getAssignments(student.studentClass);
  }, []);

  const getAssignments = async (className) => {
    try {
      const url = `http://localhost:5000/students/assignment/${className}`;
      console.log("API URL:", url);

      const res = await axios.get(url);

      console.log("API RESPONSE:", res.data);

      if (res.data.status) {
        setAssignments(res.data.data);
      } else {
        setAssignments([]);
      }

    } catch (err) {
      console.log("ERROR:", err.message);
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📚 My Assignments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : assignments.length === 0 ? (
        <p>No assignments available</p>
      ) : (
        assignments.map((a, i) => (
          <div
            key={i}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              margin: "10px 0",
              borderRadius: "8px",
              background: "#f9f9f9"
            }}
          >
            <p><b>Class:</b> {a.className}</p>
            <p><b>Subject:</b> {a.subject}</p>
            <p><b>Assignment:</b> {a.text}</p>
            <small style={{ color: "gray" }}>
              {new Date(a.date).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentAssignments;