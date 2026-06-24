import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function TeacherResults() {
  const teacherName = localStorage.getItem("teacherName") || "";

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
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
        setSelectedSubject("");
        setStudents([]);
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
  }, [selectedClass, teacherName]);

  // ================= CLASS CHANGE =================
  const handleClassChange = async (cls) => {
    setSelectedClass(cls);
    setSelectedSubject("");
    setStudents([]);
    setMarks({});

    try {
      const teacherName = localStorage.getItem("teacherName") || "";
      const res = await axios.get(
        `http://localhost:5000/teachers/subjects/${encodeURIComponent(cls)}?teacherName=${encodeURIComponent(teacherName)}`
      );
      setSubjects(res.data || []);
    } catch (err) {
      console.log(err.message);
    }
  };

  // ================= SUBJECT CHANGE =================
  const handleSubjectChange = async (sub) => {
    setSelectedSubject(sub);

    try {
      const res = await axios.get(
        `http://localhost:5000/students/byClass/${selectedClass}`
      );

      console.log("STUDENTS API:", res.data);

      if (res.data.status) {
        setStudents(res.data.students);
      } else {
        setStudents([]);
      }

    } catch (err) {
      console.log("ERROR:", err.message);
      setStudents([]);
    }
  };

  // ================= MARK INPUT =================
  const handleMarkChange = (id, value) => {
    setMarks({
      ...marks,
      [id]: value
    });
  };

  // ================= SAVE RESULT =================
  const handleSave = async () => {

    console.log("SAVE CLICKED");

    if (!selectedClass || !selectedSubject) {
      alert("Select class & subject");
      return;
    }

    // 🔥 VALIDATION: Check marks are 0-100
    for (let student of students) {
      const marksValue = Number(marks[student._id] || 0);
      
      if (marksValue < 0 || marksValue > 100) {
        alert(`❌ Invalid marks for ${student.firstName} ${student.lastName}\nMarks must be between 0-100, got: ${marksValue}`);
        return;
      }
    }

    const payload = students.map(s => ({
      studentId: s.studentId,
      name: `${s.firstName} ${s.lastName}`,
      className: selectedClass,
      subject: selectedSubject,
      marks: Number(marks[s._id] || 0)
    }));

    console.log("PAYLOAD:", payload);

    try {
      const res = await axios.post(
        "http://localhost:5000/teachers/result/add",
        { results: payload }
      );

      console.log("RESPONSE:", res.data);

      if (res.data.status || res.data.success) {
        setMessage("Marks Saved ✅");
        setTimeout(() => setMessage(""), 3000);
        
        // 🔥 Clear marks after successful save
        setMarks({});
      } else {
        setMessage(res.data.message || "Save failed ❌");
      }

    } catch (err) {
      console.log("ERROR:", err.message);
      setMessage("Server Error ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Result Entry</h2>

      {/* CLASS */}
      <select onChange={(e) => handleClassChange(e.target.value)}>
        <option value="">Select Class</option>
        {classes.map((c, i) => (
          <option key={i} value={c}>{c}</option>
        ))}
      </select>

      {/* SUBJECT */}
      {selectedClass && (
        <select onChange={(e) => handleSubjectChange(e.target.value)}>
          <option value="">Select Subject</option>
          {subjects.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </select>
      )}

      {/* STUDENTS */}
      {students.length > 0 ? (
        <>
          <table border="1" style={{ marginTop: "20px", width: "100%" }}>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Marks</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.studentId}</td>
                  <td>{`${s.firstName} ${s.lastName}`}</td>
                  <td>
                    <input
                      type="number"
                      placeholder="Marks"
                      min="0"
                      max="100"
                      value={marks[s._id] || ""}
                      onChange={(e) =>
                        handleMarkChange(s._id, e.target.value)
                      }
                      style={{
                        width: "70px",   // ✅ small width
                        padding: "4px",
                        textAlign: "center"
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSave} style={{ marginTop: "15px" }}>
            Save Marks
          </button>
        </>
      ) : selectedSubject ? (
        <p>No students found</p>
      ) : null}

      {/* MESSAGE */}
      {message && (
        <p style={{ color: message.includes("✅") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}

export default TeacherResults;