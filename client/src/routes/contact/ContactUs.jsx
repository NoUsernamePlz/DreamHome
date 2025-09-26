import React, { useState } from "react";
import "./contact.scss";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for contacting us! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contactPage">
      <h1>Contact Us</h1>
      <p>
        Have a question or want to work with us? Fill out the form below or reach
        us via the contact details provided.
      </p>

      <div className="contactContainer">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            required
          />
          <button type="submit">Send Message</button>
        </form>

        <div className="contactInfo">
          <div className="infoCard">
            <h3>Email</h3>
            <p>info@dreamhome.com</p>
          </div>
          <div className="infoCard">
            <h3>Phone</h3>
            <p>+91 123 456 7890</p>
          </div>
          <div className="infoCard">
            <h3>Address</h3>
            <p>123 Main street block l2, Delhi, India</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
