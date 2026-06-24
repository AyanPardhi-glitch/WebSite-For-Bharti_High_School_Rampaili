import React, { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

function ViewTeachers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/teachers/all");

      console.log("API DATA 👉", res.data);

      setTeachers(res.data); // ✅ FIX
    } catch (error) {
      console.log(error);
      alert("Error fetching teachers");
    }
  };

  return (
    <div>
      <h2 className="heading">All Teachers</h2>
      <h3>Total: {teachers.length}</h3>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {teachers.length > 0 ? (
            teachers.map((teacher, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{teacher.name || teacher.firstName}</td>
                <td>{teacher.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No Teachers Found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ViewTeachers;