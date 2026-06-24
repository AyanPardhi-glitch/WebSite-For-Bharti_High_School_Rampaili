import React, { useEffect, useState } from "react";
import axios from "axios";

const GenerateResult = () => {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 FETCH CLASSES
  useEffect(() => {
    axios
      .get("http://localhost:5000/students/classes")
      .then((res) => setClasses(res.data.data || []))
      .catch((err) => console.log(err));
  }, []);

  // 🔹 FETCH STUDENTS
  useEffect(() => {
    if (!className) return;

    axios
      .get(`http://localhost:5000/students/byClass/${className}`)
      .then((res) => setStudents(res.data.students || []))
      .catch(() => setStudents([]));
  }, [className]);

  // 🔹 FETCH RESULTS (FIXED SAFE HANDLING)
  useEffect(() => {
    if (!className) return;

    axios
      .get(`http://localhost:5000/results/class-result/${className}`)
      .then((res) => {
        console.log("RESULT API:", res.data);
        setResults(res.data?.data || []);
      })
      .catch(() => setResults([]));
  }, [className]);

  // 🔹 REFRESH RESULTS (Manual Refresh Button)
  const handleRefresh = async () => {
    if (!className) {
      alert("Select class first");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/results/class-result/${className}`
      );
      setResults(res.data?.data || []);
      alert("Results refreshed ✅");
    } catch (err) {
      console.log(err);
      alert("Error refreshing results");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GENERATE RESULT
  const handleGenerate = async () => {
    if (!className) {
      alert("Select class");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/results/generate-class",
        { className: className.trim() }
      );

      alert(res.data.message);

      // 🔄 refresh results
      const updated = await axios.get(
        `http://localhost:5000/results/class-result/${className}`
      );

      setResults(updated.data?.data || []);
    } catch (err) {
      console.log(err);
      alert("Error generating result");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 SUBJECTS (SAFE)
  const subjects =
    results?.length > 0
      ? [...new Set(results.flatMap((s) => s.subjects?.map((sub) => sub.subject) || []))]
      : [];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Class Result Dashboard</h2>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <select
          value={className}
          onChange={(e) => {
            setClassName(e.target.value);
            setResults([]);  // 🔥 Clear old data when class changes
          }}
          style={styles.select}
        >
          <option value="">-- Select Class --</option>
          {classes.map((c, i) => (
            <option key={i} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button onClick={handleRefresh} style={styles.button}>
          🔄 Refresh Results
        </button>

        <button onClick={handleGenerate} style={styles.button}>
          {loading ? "Processing..." : "Generate Result"}
        </button>
      </div>

      {/* TABLE */}
      {className && (
        <>
          {subjects.length === 0 ? (
            <div style={styles.noDataMessage}>
              <p>⏳ No marks data yet. Teacher needs to enter marks in Result Entry.</p>
              <p>Click "🔄 Refresh Results" after teacher saves marks.</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Student Name</th>

                    {subjects.map((s, i) => (
                      <th key={i} style={styles.th}>
                        {s}
                      </th>
                    ))}

                    {subjects.length > 0 && <th style={styles.th}>Total</th>}
                    {subjects.length > 0 && <th style={styles.th}>%</th>}
                  </tr>
                </thead>

                <tbody>
                  {students.map((stu, i) => {
                    const result = results.find(
                      (r) => r.studentId === stu.studentId
                    );

                    return (
                      <tr key={i}>
                        <td style={styles.td}>
                          {stu.firstName} {stu.lastName}
                        </td>

                        {subjects.map((sub, j) => {
                          const found = result?.subjects?.find(
                            (x) => x.subject === sub
                          );

                          return (
                            <td style={styles.td} key={j}>
                              {found ? found.marks : "-"}
                            </td>
                          );
                        })}

                        {subjects.length > 0 && (
                          <td style={styles.td}>
                            {result?.totalObtained ?? "-"}
                          </td>
                        )}

                        {subjects.length > 0 && (
                          <td style={styles.td}>
                            {result?.percentage
                              ? result.percentage.toFixed(2) + "%"
                              : "-"}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GenerateResult;

// 🎨 STYLES (UNCHANGED)
const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#0a2540",
    fontSize: "24px",
    fontWeight: "bold",
  },

  topBar: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  select: {
    padding: "10px",
    width: "200px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    padding: "10px 20px",
    backgroundColor: "#0a2540",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
    fontWeight: "bold",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },

  th: {
    border: "1px solid #ccc",
    padding: "12px",
    backgroundColor: "#0a2540",
    color: "#ffffff",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  td: {
    border: "1px solid #ccc",
    padding: "10px",
    textAlign: "center",
    backgroundColor: "#fafafa",
  },

  noDataMessage: {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#f0f4f8",
    borderRadius: "8px",
    border: "2px dashed #0a2540",
    color: "#555",
    fontSize: "16px",
    marginTop: "20px",
  },
};