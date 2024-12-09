import React, { useState } from 'react';
import axios from 'axios';
import './ContactsUs.css';
import photo3 from './pictures/photo3.jpg'; 
import logoTali from './pictures/logoTali-removebg-preview (1).png';

function ContactsUs() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false); 

  //פונקציה לעדכון שדה הקלט
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  //פוקנציה לשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post('http://localhost:3000/api/v1/contacts', form);
      
      alert('הפנייה נשלחה בהצלחה!'); 
      setForm({ firstName: '', lastName: '', phone: '', email: '', message: '' }); // ניקוי הטופס לאחר שליחה מוצלחת
    } catch (err) {
      setError('שגיאה בשליחת הפנייה. נסה שנית.');
    }
  };

  return (
    <div className="contacts-us-page">
      <h1 className="page-title">צרו איתי קשר</h1>
      <div className="contacts-us-container">
        <div className="map-container">
          <iframe
            src="https://embed.waze.com/iframe?zoom=15&lat=32.0853&lon=34.7818"
            className="waze-map"
            allowFullScreen
            title="Waze Map"
          ></iframe>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <div className="form-content-with-image">
            <div className="form-fields">
              
              <div className="form-group-container">
                <div className="form-group">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    placeholder="שם פרטי"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    placeholder="שם משפחה"
                    required
                  />
                </div>
              </div>

              
              <div className="form-row">
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    placeholder="מייל"
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    placeholder="נייד"
                    required
                  />
                </div>
              </div>

              
              <div className="form-row">
                <div className="form-group full-width">
                  <textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="סיבת פנייה"
                    required
                  ></textarea>
                </div>
              </div>

              <button type="submit" className="submit-btn">שלח</button>
            </div>

            
            <div className="image-container">
              <img src={logoTali} alt="Contact illustration" className="contact-image" />
            </div>
          </div>
        </form>
      </div>

      <div className="additional-info">
        <h2>!בואו נדבר - אני כאן בשבילכם</h2>
        <p>
          זקוקים למידע נוסף על תהליך אישי שמתאים לכם? מתעניינים בקורס או סדנה ורוצים לקבל פרטים נוספים? 
          יש לכם שאלות בנוגע לרכישה או תהליך הרשמה - אני זמינה כאן לכל צורך
        </p>
      </div>
    </div>
  );
}

export default ContactsUs;
