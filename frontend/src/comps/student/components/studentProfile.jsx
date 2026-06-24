import React, { useEffect, useState } from "react";
import "./studentProfile.css";
import "./student.css";

function StudentProfile() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("student"));
    if (data) setStudent(data);
  }, []);

  if (!student) {
    return <h2 className="no-data">No Student Data Found</h2>;
  }

  return (
    <div className="profile-wrapper">

      {/* 🔴 Cover */}
      <div className="profile-cover"></div>

      {/* 🟢 Card */}
      <div className="profile-card">

        {/* Avatar */}
        <div className="avatar">
          {student.firstName?.charAt(0)}
        </div>

        {/* Name + Class */}
        <h2>
          {student.firstName} {student.lastName}
        </h2>
        <p className="subtitle">
          Class: {student.studentClass} | {student.medium} Medium
        </p>

        {/* 🔵 Top Info Row */}
        <div className="top-info">
          <div>
            <span>Email</span>
            <p>{student.email}</p>
          </div>

          <div>
            <span>Phone</span>
            <p>{student.phone}</p>
          </div>

          <div>
            <span>Location</span>
            <p>{student.city}, {student.state}</p>
          </div>
        </div>

        {/* 🔽 Sections */}
        <div className="details">

          <div className="box">
            <h3>Basic Info</h3>
            <p><b>ID:</b> {student.studentId}</p>
            <p><b>Gender:</b> {student.gender}</p>
            <p><b>DOB:</b> {student.dob}</p>
          </div>

          <div className="box">
            <h3>Admission</h3>
            <p><b>Date:</b> {student.admissionDate}</p>
            <p><b>Status:</b> {student.status}</p>
            <p><b>TC:</b> {student.tcIssued}</p>
          </div>

          <div className="box">
            <h3>Address</h3>
            <p>{student.address}</p>
            <p>{student.city} - {student.pincode}</p>
          </div>

          <div className="box">
            <h3>Bank / Govt</h3>
            <p><b>Aadhar:</b> {student.aadhar_no}</p>
            <p><b>Account:</b> {student.account_no}</p>
            <p><b>IFSC:</b> {student.ifc_code}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default StudentProfile;