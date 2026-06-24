import React, { useEffect, useState } from "react";
import "./studentview.css";

function ViewStudent() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("1st");

  const classes = [
    "KG1", "KG2",
    "1st", "2nd", "3rd", "4th", "5th",
    "6th A", "6th B",
    "7th A", "7th B",
    "8th A", "8th B",
    "9th A", "9th B",
    "10th A", "10th B"
  ];

  useEffect(() => {
    fetch(`http://localhost:5000/students/class/${encodeURIComponent(selectedClass)}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API DATA 👉", data);

        // 🔥 IMPORTANT FIX (handle both cases)
        if (Array.isArray(data)) {
          setStudents(data);
        } else if (data.students) {
          setStudents(data.students);
        } else {
          setStudents([]);
        }
      })
      .catch((err) => {
        console.log("Fetch Error:", err);
        setStudents([]);
      });
  }, [selectedClass]);

  return (
    <div className="student-tab">

      <h2>Students</h2>

      {/* Class Filter */}
      <select
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
      >
        {classes.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>

      {/* Table */}
      <table border="1"> {/* 🔥 ensure visible */}
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Class</th>
            <th>Contact</th>
          </tr>
        </thead>

        <tbody>
          {students.length > 0 ? (
            students.map((s, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{s.firstName} {s.lastName}</td>
                <td>{s.studentClass}</td>
                <td>{s.phone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No students found</td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}

export default ViewStudent;