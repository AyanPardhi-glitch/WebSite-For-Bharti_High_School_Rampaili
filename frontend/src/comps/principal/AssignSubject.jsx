import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

// 🔥 SINGLE SOCKET (IMPORTANT)
const socket = io("http://localhost:5000");

function AssignSubject() {

  const classes = [
    "Class KG1", "Class KG2", "Class 1st","Class 2nd","Class 3rd","Class 4th","Class 5th",
    "Class 6th A","Class 7th A","Class 8th A","Class 9th A","Class 10th A",
    "Class 6th B","Class 7th B","Class 8th B","Class 9th B","Class 10th B"
  ];

  const subjects = [
    "English","Hindi","Maths","EVS","GK","Drawing",
    "Science","Social Science","Sanskrit","Navdoy"
  ];

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const periods = [1,2,3,4,5,6];

  const [selectedClass, setSelectedClass] = useState("");
  const [draft, setDraft] = useState({});
  const [submittedData, setSubmittedData] = useState({});
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 LOAD DATA (ONLY ONCE)
  useEffect(() => {

    const loadTimetables = () => {
      socket.emit("get_all_timetables");
    };

    // 🔥 CONNECT & LOAD DATA
    if (socket.connected) {
      // If already connected, load immediately
      loadTimetables();
    }

    socket.on("connect", () => {
      console.log("✅ Socket Connected");
      loadTimetables();
    });

    socket.on("load_all_timetables", (data) => {
      console.log("📦 LOADED 👉", data);
      setSubmittedData(data || {});
    });

    socket.on("update_timetable", (data) => {
      console.log("🔄 UPDATED 👉", data);
      setSubmittedData((prev) => ({
        ...prev,
        [data.className]: data.data
      }));
      setMessage("✅ Timetable saved successfully!");
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    });

    fetchTeachers();

    return () => {
      socket.off("connect");
      socket.off("load_all_timetables");
      socket.off("update_timetable");
    };

  }, []);


  // ✅ FETCH TEACHERS
  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/teachers/all");

      if (res.data.teachers) {
        setTeachers(res.data.teachers);
      } else {
        setTeachers(res.data || []);
      }

    } catch (error) {
      console.log(error);
    }
  };

  // ✅ CLASS CHANGE
  const handleClassChange = (cls) => {
    setSelectedClass(cls);

    if (submittedData[cls]) {
      setDraft({ ...submittedData[cls] });
    } else {
      setDraft({});
    }
  };

  // ✅ DRAFT CHANGE
  const handleDraftChange = (day, period, field, value) => {
    const key = `${day}-${period}`;

    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
      },
    }));
  };

  // ✅ SUBMIT (MAIN FIX)
  const handleSubmit = () => {
    if (!selectedClass) {
      setMessage("❌ Please select a class first");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (Object.keys(draft).length === 0) {
      setMessage("❌ Please add at least one subject");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    console.log("🚀 SENDING 👉", draft);

    setLoading(true);
    setMessage("⏳ Saving timetable...");

    socket.emit("update_timetable", {
      className: selectedClass,
      data: draft,
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📡 Assign Subject & Timetable</h2>

      {/* 🔥 MESSAGE BOX */}
      {message && (
        <div style={{
          ...styles.messageBox,
          backgroundColor: message.includes("✅") ? "#d4edda" : message.includes("⏳") ? "#fff3cd" : "#f8d7da",
          color: message.includes("✅") ? "#155724" : message.includes("⏳") ? "#856404" : "#721c24",
        }}>
          {message}
        </div>
      )}

      <select
        value={selectedClass}
        onChange={(e) => handleClassChange(e.target.value)}
        style={styles.select}
      >
        <option value="">-- Select Class --</option>
        {classes.map((cls, i) => (
          <option key={i} value={cls}>{cls}</option>
        ))}
      </select>

      {selectedClass && (
        <div style={styles.formContainer}>
          <h3 style={styles.formHeading}>✏️ Edit Timetable for {selectedClass}</h3>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>Day</th>
                  {periods.map((p) => <th key={p} style={styles.th}>Period {p}</th>)}
                </tr>
              </thead>

              <tbody>
                {days.map((day) => (
                  <tr key={day} style={styles.bodyRow}>
                    <td style={styles.dayCell}><strong>{day}</strong></td>

                    {periods.map((p) => {
                      const key = `${day}-${p}`;

                      return (
                        <td key={p} style={styles.periodCell}>

                          <select
                            value={draft[key]?.subject || ""}
                            onChange={(e) =>
                              handleDraftChange(day, p, "subject", e.target.value)
                            }
                            style={styles.cellSelect}
                          >
                            <option value="">Sub</option>
                            {subjects.map((sub, i) => (
                              <option key={i} value={sub}>{sub}</option>
                            ))}
                          </select>

                          <select
                            value={draft[key]?.teacher || ""}
                            onChange={(e) =>
                              handleDraftChange(day, p, "teacher", e.target.value)
                            }
                            style={styles.cellSelect}
                          >
                            <option value="">Teacher</option>
                            {teachers.map((t, i) => (
                              <option key={i} value={t.name || t.firstName}>
                                {t.name || t.firstName || t.email}
                              </option>
                            ))}
                          </select>

                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button 
            onClick={handleSubmit}
            style={{...styles.button, opacity: loading ? 0.6 : 1}}
            disabled={loading}
          >
            {loading ? "⏳ Saving..." : "💾 Save Timetable"}
          </button>
        </div>
      )}
    </div>
  );
}

// 🎨 STYLES
const styles = {
  container: {
    padding: "30px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "100vh",
  },

  heading: {
    color: "#0a2540",
    fontSize: "28px",
    marginBottom: "20px",
    textAlign: "center",
  },

  messageBox: {
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontWeight: "bold",
    textAlign: "center",
    animation: "slideIn 0.3s ease",
  },

  select: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "2px solid #0a2540",
    width: "100%",
    maxWidth: "300px",
    marginBottom: "20px",
    cursor: "pointer",
  },

  formContainer: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  formHeading: {
    color: "#0a2540",
    marginBottom: "15px",
    fontSize: "20px",
  },

  tableWrapper: {
    overflowX: "auto",
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "2px solid #0a2540",
  },

  headerRow: {
    backgroundColor: "#0a2540",
    color: "#fff",
  },

  th: {
    padding: "12px",
    textAlign: "center",
    fontWeight: "bold",
    borderRight: "1px solid #ddd",
    fontSize: "14px",
  },

  bodyRow: {
    borderBottom: "1px solid #ddd",
  },

  dayCell: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    fontWeight: "bold",
    minWidth: "80px",
    borderRight: "2px solid #0a2540",
  },

  periodCell: {
    padding: "8px",
    textAlign: "center",
    borderRight: "1px solid #ddd",
  },

  cellSelect: {
    width: "90%",
    padding: "6px",
    marginBottom: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "12px",
    display: "block",
    margin: "0 auto 5px",
  },

  button: {
    padding: "12px 30px",
    backgroundColor: "#0a2540",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(10,37,64,0.3)",
  },
};

export default AssignSubject;