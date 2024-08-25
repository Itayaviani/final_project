import React, { useState } from 'react';
import './ContactsUs.css';

function ContactsUs() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // כאן תוכל להוסיף את הלוגיקה לשליחת הפנייה
    console.log('Form submitted:', form);
  };

  return (
    <div className="contacts-us-container">
      <h1>צור קשר</h1>
      
      <div className="map-container">
        <iframe
          src="https://embed.waze.com/iframe?zoom=15&lat=32.0853&lon=34.7818"
          width="100%"
          height="400"
          allowFullScreen
          title="Waze Map"
        ></iframe>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">שם פרטי</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">שם משפחה</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">נייד</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">מייל</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="message">סיבת פנייה</label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">שלח</button>
      </form>
    </div>
  );
}

export default ContactsUs;
