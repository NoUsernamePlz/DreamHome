import React from "react";
import "./about.scss";

const About = () => {
  return (
    <div className="aboutPage">
      <section className="hero">
        <div className="text">
          <h1>About Us</h1>
          <p>
            We are dedicated to delivering innovative solutions that simplify
            life and empower businesses to grow. Our passion lies in technology,
            creativity, and customer satisfaction.
          </p>
        </div>
        <div className="image">
          <img src="/abt1.png" alt="About Us" />
        </div>
      </section>

      <section className="missionVision">
        <div className="mission">
          <h2>Our Mission</h2>
          <p>
            To provide high-quality, scalable, and reliable solutions that help
            businesses achieve their goals faster and smarter.
          </p>
        </div>
        <div className="vision">
          <h2>Our Vision</h2>
          <p>
            To become a trusted partner for companies worldwide by delivering
            innovation, excellence, and sustainable growth.
          </p>
        </div>
      </section>

      <section className="team">
        <h2>Meet Our Team</h2>
        <div className="teamMembers">
          <div className="member">
            <img src="/km.jpg" alt="Team Member" />
            <h3>Komal Kumari</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="member">
            <img src="/km3.jpg" alt="Team Member" />
            <h3>John Doe</h3>
            <p>Lead Developer</p>
          </div>
          <div className="member">
            <img src="/km3.jpg" alt="Team Member" />
            <h3>Jane Smith</h3>
            <p>Product Manager</p>
          </div>
        </div>
      </section>

      <section className="values">
        <h2>Our Values</h2>
        <ul>
          <li>Innovation & Creativity</li>
          <li>Integrity & Transparency</li>
          <li>Customer Satisfaction</li>
          <li>Teamwork & Collaboration</li>
          <li>Continuous Learning</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
