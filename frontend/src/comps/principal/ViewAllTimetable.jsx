import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const socket = io("http://localhost:5000");

function ViewAllTimetable() {

  const tableRef = useRef(null);
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const periods = [1,2,3,4,5,6];

  const classes = [
    "Class KG1", "Class KG2", "Class 1st","Class 2nd","Class 3rd","Class 4th","Class 5th",
    "Class 6th A","Class 7th A","Class 8th A","Class 9th A","Class 10th A",
    "Class 6th B","Class 7th B","Class 8th B","Class 9th B","Class 10th B"
  ];

  const [allData, setAllData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("Class 1st");

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
      console.log("✅ Socket Connected for View");
      loadTimetables();
    });

    socket.on("load_all_timetables", (data) => {
      console.log("📊 Timetables Loaded:", data);
      setAllData(data || {});
      setLoading(false);
    });

    socket.on("update_timetable", (data) => {
      console.log("🔄 Timetable Updated:", data);
      setAllData((prev) => ({
        ...prev,
        [data.className]: data.data
      }));
    });

    return () => {
      socket.off("connect");
      socket.off("load_all_timetables");
      socket.off("update_timetable");
    };

  }, []);

  // 🔥 DOWNLOAD TIMETABLE AS PDF
  const handleDownload = async () => {
    if (!tableRef.current) return;

    try {
      const canvas = await html2canvas(tableRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("l", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add School Name at Top
      pdf.setFontSize(18);
      pdf.setTextColor(10, 37, 64);
      pdf.text("BHARTI ENGLISH HIGH SCHOOL RAMPAYLI", pageWidth / 2, 15, { align: "center" });

      // Add Timetable Title
      pdf.setFontSize(14);
      pdf.setTextColor(10, 37, 64);
      pdf.text("📋 TIMETABLE", pageWidth / 2, 22, { align: "center" });

      // Add Class Name
      pdf.setFontSize(12);
      pdf.setTextColor(10, 37, 64);
      pdf.text(`Class: ${selectedClass}`, pageWidth / 2, 29, { align: "center" });

      // Add Date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth / 2, 35, { align: "center" });

      // Add Table Image
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 42, imgWidth, imgHeight);

      pdf.save(`${selectedClass}-Timetable.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("❌ Error downloading timetable");
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>📊 View All Timetables</h2>
        <div style={styles.loadingBox}>⏳ Loading timetables...</div>
      </div>
    );
  }

  const hasData = Object.keys(allData).length > 0;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 View All Timetables</h2>

      {/* CLASS SELECTOR */}
      <select 
        value={selectedClass}
        onChange={(e) => setSelectedClass(e.target.value)}
        style={styles.classSelect}
      >
        {classes.map((cls) => (
          <option key={cls} value={cls}>{cls}</option>
        ))}
      </select>

      {!hasData && (
        <div style={styles.emptyBox}>
          📋 No timetable data available yet. Please assign subjects first.
        </div>
      )}

      {/* SINGLE CLASS TIMETABLE VIEW */}
      {selectedClass && allData[selectedClass] && (
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h3 style={styles.className}>{selectedClass}</h3>
            <button 
              onClick={handleDownload}
              style={styles.downloadBtn}
              title="Download as PDF"
            >
              📥 Download PDF
            </button>
          </div>
          
          <div ref={tableRef} style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.headerRow}>
                  <th style={styles.th}>Day / Period</th>
                  {periods.map(p => (
                    <th key={p} style={styles.th}>Period {p}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {days.map(day => (
                  <tr key={day} style={styles.bodyRow}>
                    <td style={styles.dayCell}><strong>{day}</strong></td>

                    {periods.map(p => {
                      const key = `${day}-${p}`;
                      const cell = allData[selectedClass]?.[key];

                      return (
                        <td key={p} style={styles.dataCell}>
                          {cell ? (
                            <div style={styles.cellContent}>
                              <div style={styles.subject}>{cell.subject}</div>
                              <div style={styles.teacher}>{cell.teacher || "TBA"}</div>
                            </div>
                          ) : (
                            <div style={styles.empty}>-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClass && !allData[selectedClass] && (
        <div style={styles.emptyBox}>
          📋 No timetable assigned for {selectedClass} yet.
        </div>
      )}
    </div>
  );
}

export default ViewAllTimetable;

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

  classSelect: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "2px solid #0a2540",
    width: "100%",
    maxWidth: "400px",
    marginBottom: "20px",
    cursor: "pointer",
  },

  loadingBox: {
    textAlign: "center",
    padding: "40px",
    fontSize: "18px",
    color: "#666",
  },

  emptyBox: {
    backgroundColor: "#e3f2fd",
    borderLeft: "5px solid #2196F3",
    padding: "20px",
    borderRadius: "8px",
    color: "#1976d2",
    fontSize: "16px",
    marginTop: "20px",
  },

  tableCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },

  className: {
    color: "#0a2540",
    marginTop: 0,
    marginBottom: "15px",
    fontSize: "20px",
    borderBottom: "2px solid #0a2540",
    paddingBottom: "10px",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  downloadBtn: {
    padding: "10px 15px",
    backgroundColor: "#0a2540",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },

  tableWrapper: {
    overflowX: "auto",
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
    borderRight: "1px solid rgba(255,255,255,0.2)",
    fontSize: "14px",
  },

  bodyRow: {
    borderBottom: "1px solid #ddd",
  },

  dayCell: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    fontWeight: "bold",
    minWidth: "100px",
    borderRight: "2px solid #0a2540",
    color: "#0a2540",
  },

  dataCell: {
    padding: "10px 8px",
    textAlign: "center",
    borderRight: "1px solid #ddd",
    minHeight: "60px",
    verticalAlign: "middle",
  },

  cellContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  subject: {
    fontWeight: "bold",
    color: "#0a2540",
    fontSize: "14px",
  },

  teacher: {
    color: "#666",
    fontSize: "12px",
    fontStyle: "italic",
  },

  empty: {
    color: "#ccc",
    fontSize: "18px",
    fontWeight: "bold",
  },
};