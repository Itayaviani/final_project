import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaIdCard } from "react-icons/fa";
import "./register.css";

export default function Register() {
  const [inputData, setInputData] = useState({
    name: "",
    phone: "",
    email: "",
    idNumber: "", 
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  // פונקציה לניהול שינויים בשדות הקלט
  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  // פונקציה להחלפת מצב הצגת הסיסמא
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); 
  };

  // פונקציה לשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // שולחת בקשה לשרת ליצירת משתמש חדש
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/register",
        inputData
      );
      console.log("ההרשמה בוצעה בהצלחה:", response.data);

      alert("ההרשמה בוצעה בהצלחה, ברוך/ה הבא/ה!");

      setInputData({
        name: "",
        phone: "",
        email: "",
        idNumber: "", 
        password: ""
      });

      navigate("/login");
    } catch (error) {
      const serverMessage = error.response?.data?.message || "ההרשמה נכשלה, אנא נסה/י מחדש.";

      // טיפול בשגיאות
      if (serverMessage.includes("תעודת הזהות")) {
        setErrorMessage("תעודת הזהות הזו כבר קיימת במערכת");
      } else if (serverMessage.includes("מייל")) {
        setErrorMessage("המייל הזה כבר קיים במערכת");
      } else if (serverMessage.includes("מספר הטלפון")) {
        setErrorMessage("מספר הטלפון הזה כבר קיים במערכת");
      } else {
        setErrorMessage(serverMessage);
      }

      alert(serverMessage);
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-page-container">
        <h2 className="register-page-title">להרשמה</h2>
        <form onSubmit={handleSubmit} className="register-page-form">
          <div className="register-page-input-group">
            <span className="icon"><FaUser /></span>
            <input
              type="text"
              name="name"
              value={inputData.name}
              onChange={handleChange}
              placeholder="שם מלא"
              required
            />
          </div>
          <div className="register-page-input-group">
            <span className="icon"><FaPhone /></span>
            <input
              type="text"
              name="phone"
              value={inputData.phone}
              onChange={handleChange}
              placeholder="טלפון"
              required
            />
          </div>
          <div className="register-page-input-group">
            <span className="icon"><FaEnvelope /></span>
            <input
              type="email"
              name="email"
              value={inputData.email}
              onChange={handleChange}
              placeholder="אימייל"
              required
            />
          </div>
          <div className="register-page-input-group">
            <span className="icon"><FaIdCard /></span>
            <input
              type="text"
              name="idNumber"
              value={inputData.idNumber}
              onChange={handleChange}
              placeholder="תעודת זהות"
              required
            />
          </div>
          <div className="register-page-input-group">
            <span className="icon"><FaLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={inputData.password}
              onChange={handleChange}
              placeholder="סיסמא"
              required
            />
            <span className="icon eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="register-page-btn">להרשמה</button>
        </form>

        

        <div className="register-page-navToLogin">
          <p className="register-page-link">
            כבר רשום/ה? <Link to="/login">להתחברות</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
