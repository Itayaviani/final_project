import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./register.css";

export default function Register() {
  const [inputData, setInputData] = useState({
    name: "",
    phone: "",
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // נווט לדף התחברות

  const handleChange = (e) => {
    // בכל שינוי, העדכון של השדות
    setInputData({ ...inputData, [e.target.name]: e.target.value });
    setErrorMessage(""); // איפוס הודעת השגיאה בזמן שמשתמש משנה נתון
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // שליחת הנתונים לשרת
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/register",
        inputData
      );
      console.log('Registration successful:', response.data);

      // הצגת הודעת הצלחה והמעבר לעמוד התחברות
      alert('ההרשמה בוצעה בהצלחה, ברוך/ה הבא/ה!');
      
      // ריקון השדות לאחר הצלחה
      setInputData({
        name: "",
        phone: "",
        email: "",
        password: ""
      });

      // נווט לדף התחברות
      navigate('/login');

    } catch (error) {
      // טיפול בהצגת הודעת השגיאה מהשרת אם יש
      const serverMessage = error.response?.data?.message || 'ההרשמה נכשלה, אנא נסה/י מחדש.';
      setErrorMessage(serverMessage); // שמירת הודעת השגיאה ב-state

      // הצגת הודעת השגיאה למשתמש ב-alert
      alert(serverMessage);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="container-register">
        <h2 className="title-register">להרשמה</h2>
        <form onSubmit={handleSubmit} className="form-register">
          <div className="label-input-register">
            <label htmlFor="name"></label>
            <input
              type="text"
              name="name"
              value={inputData.name} // חיבור ל-state של inputData
              onChange={handleChange}
              placeholder="שם מלא"
              required
            />
          </div>
          <div className="label-input-register">
            <label htmlFor="phone"></label>
            <input
              type="text"
              name="phone"
              value={inputData.phone} // חיבור ל-state של inputData
              onChange={handleChange}
              placeholder="טלפון"
              required
            />
          </div>
          <div className="label-input-register">
            <label htmlFor="email"></label>
            <input
              type="email"
              name="email"
              value={inputData.email} // חיבור ל-state של inputData
              onChange={handleChange}
              placeholder="אימייל"
              required
            />
          </div>
          <div className="label-input-register">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              value={inputData.password} // חיבור ל-state של inputData
              onChange={handleChange}
              placeholder="סיסמא"
              required
            />
          </div>
          <button type="submit" className="btn-register">להרשמה</button>
        </form>

        {/* הצגת הודעת שגיאה בממשק אם ישנה */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        
        <div className="navToLogin">
          <p className="register-link">
            כבר רשום/ה? <Link to="/login">להתחברות</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
