import React, { useState, useEffect } from "react";
import "./home.css";
import schoolImg from "../../assets/school1.webp";
import qualityImg from "../../assets/school2.jpg";
import principalImg from "../../assets/principal1.jpg";
import bgImg from "../../assets/image2.jpg";

import chairman from "../../assets/chairman.jpg";
import viceChairman from "../../assets/viceChairman.jpg";
import secretary from "../../assets/secretary.jpg";
import jointSecretary from "../../assets/jointSecretary.jpg";
import treasurer from "../../assets/treasurer.jpg";
import principal from "../../assets/principal.jpg";
import vicePrincipal from "../../assets/vicePrincipal.jpg";
import manager from "../../assets/manager.jpg";
import membersImg from "../../assets/membersImg.jpg";


function Home() {

const members = [
  {
    name: "Mr. Rajesh Kumar",
    designation: "अध्यक्ष (Chairman)",
    image: chairman,
  },
  {
    name: "Mr. Sandeep Kumar",
    designation: "उपाध्यक्ष (Vice Chairman)",
    image: viceChairman,
  },
  {
    name: "Mr. Amit Kumar",
    designation: "सचिव (Secretary)",
    image: secretary,
  },
  {
    name: "Mrs. Pooja Singh",
    designation: "सह सचिव (Joint Secretary)",
    image: jointSecretary,
  },
  {
    name: "Mr. Vijay Gupta",
    designation: "कोषाध्यक्ष (Treasurer)",
    image: treasurer,
  },
  {
    name: "Dr. Ayan Pardhi",
    designation: "प्रधानाचार्य (Principal)",
    image: principal,
  },
  {
    name: "Mr. Rakesh Yadav",
    designation: "उप-प्रधानाचार्य (Vice Principal)",
    image: vicePrincipal,
  },
  {
    name: "Mr. Amit Patel",
    designation: "प्रबंधक (Manager)",
    image: manager,
  },
  {
    name: "School Committee",
    designation: "सदस्य (Committee Members)",
    image: membersImg,
  },
];

const [current, setCurrent] = useState(0);
const visibleCount = 3;
const visibleMembers = Array.from({ length: visibleCount }, (_, i) =>
  members[(current + i) % members.length]
);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrent((prev) => (prev + 1) % members.length);
  }, 4000);

  return () => clearInterval(interval);
}, []);

  return (
    <div className="home">

      {/* Navbar */}
      <div className="navbar">
        <h2>Rampaili Mitra-Mandal Rampaili</h2>
        <ul>
          <li>Admission-Open 2026-27</li>
          <li>Events</li>
          <li>Contact</li>
        </ul>
      </div>

      {/* About Section */}
      <div className="about">
        <div className="about-left">
          <img src={schoolImg} alt="school" />
        </div>

        <div className="about-right">
          <h2>Introduction</h2>
          <p>
           Privt. HS BHARTI, RAMPAILY was established in 1984 and it is managed by the Pvt. Unaided. It is located in Rural area. It is located in WARA SEONI block of BALAGHAT district of Madhya Pradesh. The school consists of Grades from 1 to 10. The school is Co-educational and it have an attached pre-primary section. The school is Not Applicable in nature and is not using school building as a shift-school. Hindi is the medium of instructions in this school. This school is approachable by all weather road. In this school academic session starts in April.
          </p>
          <button>Read More</button>
        </div>
      </div>

      {/* Principal Section */}
      <div className="principal-section">
        <div className="principal-image">
          <img src={principalImg} alt="Principal Bharti High School" />
        </div>
        <div className="principal-info">
          <h2>Meet Our Principal</h2>
          <h3>Mrs. Ayan Pardhi</h3>
          <p>Principal, Bharti High School Rampaili</p>
          <p>
            With more than 20 years of experience in school leadership, she is
            committed to academic excellence, discipline and holistic student
            development.
          </p>
          <p>
            Her vision is to empower every student with knowledge, values and
            confidence in a safe, nurturing learning environment.
          </p>
        </div>
      </div>

      {/* Management Section */}
      <div className="management-section">
        <h2>Our Management Committee</h2>

        <div className="member-list">
          {visibleMembers.map((member, index) => (
            <div className="member-card" key={`${member.name}-${index}`}>
              <img
                src={member.image}
                alt={member.designation}
                className="member-image"
              />
              <h3>{member.designation}</h3>
              <p>{member.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <h2>Our School Highlights</h2>

        <div className="feature-grid">
          <div className="card" style={{ backgroundImage: `url(${bgImg})` }}>
            <h3>Strong Foundation</h3>
            <p>Strong Foundation From Class 1 to 10</p>
          </div>

          <div className="card" style={{ backgroundImage: `url(${bgImg})` }}>
            <h3>Qualified Teaching Staff</h3>
            <p>Dedicated and Qualified Teaching Staff</p>
          </div>

          <div className="card" style={{ backgroundImage: `url(${bgImg})` }}>
            <h3>Values and Discipline</h3>
            <p>Focus on Moral Values and Discipline</p>
          </div>

          <div className="card" style={{ backgroundImage: `url(${bgImg})` }}>
            <h3>Physical Fitness</h3>
            <p>Encouraging Physical Fitness and Games</p>
          </div>

          <div className="card" style={{ backgroundImage: `url(${bgImg})` }}>
            <h3>Secure Campus</h3>
            <p>Secure and Friendly Campus For Students</p>
          </div>

          <div className="card" style={{ backgroundImage: `url(${bgImg})` }}>
            <h3>Programs and Events</h3>
            <p>Arts, Cultural Programs and Events</p>
          </div>
        </div>
      </div>

      {/* 📍 LOCATION SECTION (NEW ADD) */}
      <div className="location-section">

        {/* Map */}
        <div className="location-map">
          <iframe
            src="https://www.google.com/maps?q=Rampaili,Balaghat,Madhya+Pradesh&output=embed"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="school-location"
          ></iframe>
        </div>

        {/* Content */}
        <div className="location-content">
          <h2>Our Location</h2>
          <p>
            Bharti High School is located in Rampaili, Balaghat district of
            Madhya Pradesh. It is easily accessible and provides a peaceful
            learning environment for students.
          </p>

          <p><strong>📍 Address:</strong> Rampaili, Balaghat, Madhya Pradesh</p>

          <a
            href="https://www.google.com/maps?q=Rampaili,Balaghat,Madhya+Pradesh"
            target="_blank"
            rel="noopener noreferrer"
            className="map-btn"
          >
            View on Google Maps
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">

          <div className="footer-section">
            <h2>Bharti High School</h2>
            <p>
              Providing quality education since 1984. 
              Building strong foundation for students.
            </p>
          </div>

          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>Home</li>
              <li>About</li>
              <li>Contact</li>
              <li>Admissions</li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>📍 Rampaili, Balaghat, MP</p>
            <p>📞 +91 6262093529</p>
            <p>✉️ school@email.com</p>
          </div>

        </div>

        <div className="footer-bottom">
          <p>© 2026 Bharti High School | All Rights Reserved</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;