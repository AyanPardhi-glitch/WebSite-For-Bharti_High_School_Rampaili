import React from "react";
import "./about.css";

export default function AboutSchool() {
  return (
    <section className="about-school-section">
      <div className="about-container">

        {/* Image Section */}
        <div className="about-image-wrapper">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop"
            alt="Bharti High School Rampaily"
            className="about-school-image"
          />

          <div className="image-overlay-card">
            <h3>Bharti High School Rampaily</h3>
            <p>Quality Education & Bright Future</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="about-content">
          <span className="about-tag">ABOUT OUR SCHOOL</span>

          <h2>Welcome to Bharti High School Rampaily</h2>

          <p>
            Bharti High School Rampaily is a well-known educational institution
            dedicated to academic excellence, discipline, and student
            development. The school is located in front of the famous Ram
            Mandir and beside the beautiful Chandan River.
          </p>

          <p>
            Our school has more than 25 spacious classrooms, 25+ experienced
            teachers, and 5 supportive staff members who work together to
            provide students with the best educational experience.
          </p>

          <p>
            Bharti High School also encourages sports and extracurricular
            activities. The campus includes 3 large playgrounds along with
            proper sports kits and facilities for students.
          </p>

          {/* Stats */}
        </div>

        <div className="stats-grid">

          <div className="stat-card">
            <h3>25+</h3>
            <p>Classrooms</p>
          </div>

          <div className="stat-card">
            <h3>25+</h3>
            <p>Teachers</p>
          </div>

          <div className="stat-card">
            <h3>3</h3>
            <p>Playgrounds</p>
          </div>

          <div className="stat-card">
            <h3>A1</h3>
            <p>Results</p>
          </div>

        </div>

        <button className="explore-btn">
          Explore More
        </button>
      </div>
    </section>
  );
}