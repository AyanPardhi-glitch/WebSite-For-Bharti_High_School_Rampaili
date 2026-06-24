import React from "react";
import "./footer.css";

function Contact() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* School Info */}
        <div className="footer-section">
          <h2>Bharti High School</h2>
          <p>
            Providing quality education since 1984. 
            Building strong foundation for students.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
            <li>Admissions</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📍 Rampaili, Balaghat, MP</p>
          <p>📞 +91 6262093529</p>
          <p>✉️ school@email.com</p>
        </div>

      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 Bharti High School | All Rights Reserved</p>
      </div>
    </footer>
  );  
}

export default Contact;