// 🎨 HELPER FUNCTION FOR GRADE COLOR
export const getGradeColor = (grade) => {
  switch (grade) {
    case "A+": return "#2ecc71"; // Green
    case "A": return "#27ae60";  // Dark Green
    case "B": return "#f39c12";  // Orange
    case "C": return "#e74c3c";  // Red
    default: return "#95a5a6";   // Gray
  }
};

// 🎨 STYLES
export const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  loadingBox: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "60px 30px",
    backgroundColor: "#fff",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 5px 30px rgba(0,0,0,0.1)",
  },

  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #0a2540",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "20px auto",
  },

  errorBox: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "40px",
    backgroundColor: "#fff3cd",
    borderLeft: "5px solid #ff6b6b",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(255,0,0,0.1)",
  },

  emptyBox: {
    maxWidth: "600px",
    margin: "100px auto",
    padding: "50px 40px",
    backgroundColor: "#e3f2fd",
    borderLeft: "5px solid #2196F3",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(33,150,243,0.1)",
  },

  card: {
    maxWidth: "900px",
    margin: "0 auto 30px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    pageBreakInside: "avoid",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    borderBottom: "3px solid #0a2540",
    paddingBottom: "20px",
    marginBottom: "30px",
    textAlign: "center",
    justifyContent: "center",
  },

  schoolLogo: {
    fontSize: "48px",
  },

  headerContent: {
    flex: 1,
  },

  schoolName: {
    margin: 0,
    color: "#0a2540",
    fontSize: "32px",
    fontWeight: "900",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  schoolInfo: {
    margin: "5px 0 3px",
    color: "#555",
    fontSize: "14px",
    fontWeight: "500",
  },

  schoolDate: {
    margin: "3px 0 0",
    color: "#888",
    fontSize: "12px",
    fontStyle: "italic",
  },

  studentInfo: {
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    border: "1px solid #e0e0e0",
  },

  infoRow: {
    display: "flex",
    gap: "40px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },

  infoPair: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: "250px",
  },

  label: {
    fontWeight: "600",
    color: "#0a2540",
    minWidth: "140px",
  },

  value: {
    color: "#333",
    fontSize: "15px",
  },

  gradeBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "14px",
  },

  tableContainer: {
    marginBottom: "30px",
  },

  tableTitle: {
    color: "#0a2540",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  headerRow: {
    backgroundColor: "#0a2540",
    color: "#fff",
  },

  th: {
    padding: "15px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "14px",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },

  bodyRow: {
    borderBottom: "1px solid #e0e0e0",
    transition: "backgroundColor 0.2s",
  },

  td: {
    padding: "14px 15px",
    fontSize: "14px",
    color: "#333",
  },

  summary: {
    backgroundColor: "#f0f7ff",
    padding: "30px",
    borderRadius: "12px",
    border: "2px solid #0a2540",
    marginBottom: "30px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
  },

  summaryBox: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid #e0e0e0",
  },

  summaryLabel: {
    display: "block",
    color: "#666",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: "8px",
  },

  summaryValue: {
    margin: 0,
    color: "#0a2540",
    fontSize: "24px",
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    borderTop: "1px solid #e0e0e0",
    paddingTop: "20px",
    color: "#999",
    fontSize: "12px",
  },

  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    maxWidth: "900px",
    margin: "0 auto",
    flexWrap: "wrap",
  },

  downloadButton: {
    padding: "12px 30px",
    backgroundColor: "#0a2540",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(10,37,64,0.3)",
  },

  printButton: {
    padding: "12px 30px",
    backgroundColor: "#666",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
};
