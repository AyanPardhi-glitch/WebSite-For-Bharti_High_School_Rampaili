import React, { useEffect, useState } from "react";
import axios from "axios";

function PrincipalAttendance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const fetchAllAttendance = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:5000/attendance/all-classes"
      );

      // 🔥 SAFE CHECK (IMPORTANT FIX)
      const result = Array.isArray(res.data) ? res.data : [];

      setData(result);
      setLoading(false);

    } catch (err) {
      console.log("API Error:", err.message);
      setLoading(false);
      setData([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Principal Attendance Dashboard</h2>

      {/* LOADING */}
      {loading && <p>Loading attendance data...</p>}

      {/* NO DATA */}
      {!loading && data.length === 0 && (
        <p>No attendance data found</p>
      )}

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        {data.map((cls, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
              background: "#fff",
            }}
          >
            {/* CLASS NAME */}
            <h3 style={{ textAlign: "center" }}>
              {cls?.className || "Unknown Class"}
            </h3>

            <hr />

            {/* PRESENT & ABSENT */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div style={{ color: "green", fontWeight: "bold" }}>
                ✅ Present <br />
                {cls?.present ?? 0}
              </div>

              <div style={{ color: "red", fontWeight: "bold" }}>
                ❌ Absent <br />
                {cls?.absent ?? 0}
              </div>
            </div>

            {/* TOTAL */}
            <p style={{ textAlign: "center", marginTop: "10px" }}>
              Total: {cls?.total ?? 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrincipalAttendance;