import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { styles, getGradeColor } from "./resultStyles";

const StudentResult = ({ studentId: propStudentId }) => {
  const [result, setResult] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const printRef = useRef();

  // 🔹 FETCH RESULT
  useEffect(() => {
    // Get studentId from localStorage (use generated studentId, not _id)
    const studentObj = JSON.parse(localStorage.getItem("student"));
    const id = propStudentId || studentObj?.studentId;
    
    // Store student info for class display
    setStudent(studentObj);
    
    if (!id) {
      setError("Student ID not found. Please login again.");
      return;
    }

    setLoading(true);
    setError(null);

    console.log("Fetching result for studentId:", id); // Debug

    axios
      .get(`http://localhost:5000/results/final/${id}`)
      .then((res) => {
        console.log("Result API Response:", res.data);
        if (res.data?.data) {
          setResult(res.data.data);
          setError(null);
        } else {
          setError("No result found for this student. Please wait for principal to generate it.");
          setResult(null);
        }
      })
      .catch((err) => {
        console.error("Error fetching result:", err);
        setError("Failed to fetch result. Please try again.");
        setResult(null);
      })
      .finally(() => setLoading(false));
  }, [propStudentId]);

  // 🔥 DOWNLOAD PDF
  const downloadPDF = async () => {
    if (!printRef.current) return;

    setDownloading(true);

    try {
      const element = printRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: true,
      });

      const data = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Check if content fits on one page, if not add multiple pages
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(data, "PNG", 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(data, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      const fileName = `Marksheet_${result?.studentId || student?.studentId || 'Student'}.pdf`;
      pdf.save(fileName);
      
      alert("✅ PDF downloaded successfully!");
    } catch (err) {
      console.error("PDF Error:", err);
      alert("❌ PDF download failed: " + err.message);
    }

    setDownloading(false);
  };

  // 🔥 LOADING STATE
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingBox}>
          <h3>📚 Loading your result...</h3>
          <div style={styles.spinner}></div>
        </div>
      </div>
    );
  }

  // 🔥 ERROR STATE
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorBox}>
          <h3>⚠️ {error}</h3>
          <p>If you believe this is an error, please contact the principal.</p>
        </div>
      </div>
    );
  }

  // 🔥 NO RESULT STATE
  if (!result) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyBox}>
          <h3>📋 No result found yet</h3>
          <p>Your result will be available here once the principal generates it.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* 🔥 MARKSHEET AREA */}
      <div ref={printRef} style={styles.card}>

        {/* ================= HEADER ================= */}
        <div style={styles.header}>
          <div style={styles.schoolLogo}>🎓</div>
          <div style={styles.headerContent}>
            <h1 style={styles.schoolName}>BHARTI ENGLISH HIGH SCHOOL</h1>
            <p style={styles.schoolInfo}>Rampayli</p>
            <p style={styles.schoolDate}>Official Academic Result Sheet | Generated: {new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </div>

        {/* ================= STUDENT INFO ================= */}
        <div style={styles.studentInfo}>
          <div style={styles.infoRow}>
            <div style={styles.infoPair}>
              <span style={styles.label}>Student Name:</span>
              <span style={styles.value}>{result?.name || "N/A"}</span>
            </div>
            <div style={styles.infoPair}>
              <span style={styles.label}>Class:</span>
              <span style={styles.value}>{student?.studentClass || result?.className || "N/A"}</span>
            </div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoPair}>
              <span style={styles.label}>Student ID:</span>
              <span style={styles.value}>{result?.studentId || "N/A"}</span>
            </div>
            <div style={styles.infoPair}>
              <span style={styles.label}>Grade:</span>
              <span style={{...styles.value, ...styles.gradeBadge, backgroundColor: getGradeColor(result?.grade)}}>{result?.grade || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* ================= MARKS TABLE ================= */}
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>📚 Subject-wise Performance</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.headerRow}>
                <th style={styles.th}>Subject</th>
                <th style={styles.th}>Marks Obtained</th>
                <th style={styles.th}>Total Marks</th>
                <th style={styles.th}>Percentage</th>
              </tr>
            </thead>

            <tbody>
              {result?.subjects && result.subjects.length > 0 ? (
                result.subjects.map((sub, i) => (
                  <tr key={i} style={styles.bodyRow}>
                    <td style={styles.td}>{sub.subject}</td>
                    <td style={styles.td}>
                      <strong>{sub.marks}</strong>
                    </td>
                    <td style={styles.td}>{sub.totalMarks}</td>
                    <td style={styles.td}>
                      {sub.totalMarks ? ((sub.marks / sub.totalMarks) * 100).toFixed(1) : "0"}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{...styles.td, textAlign: "center", color: "#999"}}>
                    No subjects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= SUMMARY ================= */}
        <div style={styles.summary}>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Total Marks Obtained</span>
              <h3 style={styles.summaryValue}>{result?.totalObtained || 0}</h3>
            </div>
            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Total Marks</span>
              <h3 style={styles.summaryValue}>{result?.totalMarks || 0}</h3>
            </div>
            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Percentage</span>
              <h3 style={styles.summaryValue}>{result?.percentage?.toFixed(2) || 0}%</h3>
            </div>
            <div style={styles.summaryBox}>
              <span style={styles.summaryLabel}>Grade</span>
              <h3 style={{...styles.summaryValue, color: getGradeColor(result?.grade)}}>{result?.grade || "N/A"}</h3>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div style={styles.footer}>
          <p>This is an official document. Valid only with school stamp and principal's signature.</p>
          <p>Generated on: {new Date().toLocaleString('en-IN')}</p>
        </div>

      </div>

      {/* 🔥 ACTION BUTTONS */}
      <div style={styles.buttonGroup}>
        <button
          onClick={downloadPDF}
          style={styles.downloadButton}
          disabled={downloading}
        >
          {downloading ? "⏳ Generating PDF..." : "📥 Download Marksheet"}
        </button>
        <button
          onClick={() => window.print()}
          style={styles.printButton}
        >
          🖨️ Print
        </button>
      </div>
    </div>
  );
};

export default StudentResult;