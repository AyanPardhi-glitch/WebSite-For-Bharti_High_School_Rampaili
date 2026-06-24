import React, { useState } from "react";
import axios from "axios";
import "./teacherDashboard.css";

const classes = [
  "KG1", "KG2",
  "1st", "2nd", "3rd", "4th", "5th",
  "6th A", "6th B",
  "7th A", "7th B",
  "8th A", "8th B",
  "9th A", "9th B",
  "10th A", "10th B"
];

function Attendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // ✅ NEW
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");

  // ===============================
  // FETCH STUDENTS
  // ===============================
  const fetchStudents = async (cls) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/students/class/${encodeURIComponent(cls)}`
      );
      setStudents(res.data.students || []);
    } catch (err) {
      console.log("Student fetch error:", err.message);
    }
  };

  // ===============================
  // FETCH ATTENDANCE
  // ===============================
  const fetchAttendance = async (cls, date) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/attendance/get",
        {
          params: {
            className: cls,
            date: date, // ✅ FIXED
          },
        }
      );

      setAttendance(res.data.records || {});
    } catch (err) {
      console.log("Attendance fetch error:", err.message);
    }
  };

  // ===============================
  // CLASS CHANGE
  // ===============================
  const handleClassChange = (cls) => {
    setSelectedClass(cls);

    if (!cls) {
      setStudents([]);
      return;
    }

    fetchStudents(cls);
    fetchAttendance(cls, selectedDate);
  };

  // ===============================
  // DATE CHANGE
  // ===============================
  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (selectedClass) {
      fetchAttendance(selectedClass, date);
    }
  };

  // ===============================
  // MARK ATTENDANCE
  // ===============================
  const attendanceMark = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/attendance/save",
        {
          className: selectedClass,
          attendance,
          date: selectedDate, // ✅ FIXED
        }
      );

      setMessage(res.data.message || "Saved ✅");
      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      console.log("Save error:", err.message);
    }
  };

  return (
    <div style={{ padding: "20px", marginTop: "40px" }}>
      <h2>📊 Attendance</h2>

      {/* ✅ FILTER ROW */}
      <div className="filter-row">

        {/* CLASS */}
        <select
          value={selectedClass}
          onChange={(e) => handleClassChange(e.target.value)}
          className="input-small"
        >
          <option value="">Select Class</option>
          {classes.map((cls, i) => (
            <option key={i} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        {/* DATE */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="input-small"
        />
      </div>

      {/* MESSAGE */}
      {message && <p className="success-msg">{message}</p>}

      {/* TABLE */}
      {students.length > 0 ? (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.studentClass}</td>

                  <td>
                    <button
                      className={
                        attendance[s._id] === "Present"
                          ? "btn-present active"
                          : "btn-present"
                      }
                      onClick={() => attendanceMark(s._id, "Present")}
                    >
                      P
                    </button>

                    <button
                      className={
                        attendance[s._id] === "Absent"
                          ? "btn-absent active"
                          : "btn-absent"
                      }
                      onClick={() => attendanceMark(s._id, "Absent")}
                    >
                      A
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="save-btn" onClick={handleSubmit}>
            Save Attendance
          </button>
        </>
      ) : (
        selectedClass && <p>No students found</p>
      )}
    </div>
  );
}

export default Attendance;