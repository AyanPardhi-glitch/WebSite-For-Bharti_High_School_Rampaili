import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { FaUserGraduate, FaChalkboardTeacher, FaSchool } from "react-icons/fa";
import { MdEvent, MdPayment } from "react-icons/md";
import { AiFillSchedule } from "react-icons/ai";



function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="header">
      <h2>Bharti High School Rampaili</h2>

      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/admission">Admission</Link></li>
        </ul>
      </nav>

      {/* ☰ Hamburger Icon */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      {/* Dropdown Menu */}
      
      {menuOpen && (
  <div className="menu">
    <ul>
      <li><FaUserGraduate /> <Link to="/student-login">Student</Link></li>
      <li><FaChalkboardTeacher /> <Link to="/teacher-login">Teacher</Link></li>      
      <li><AiFillSchedule /> <Link to="/principal-login">Principal</Link></li>
      <li><MdEvent /> <Link to="/exams">Exams</Link></li>
      <li><MdPayment /> <Link to="/fee-management">Fees</Link></li>
    </ul>
  </div>
)}
    </div>
  );
}

export default Header;