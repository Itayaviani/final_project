import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // ייבוא אייקוני העין
import "./login.css";

export default function Login({ setIsLoggedIn, setUsername, setIsAdmin }) {
  const [inputData, setInputData] = useState({});
  const [showPassword, setShowPassword] = useState(false); // סטייט לניהול תצוגת הסיסמה
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // שינוי מצב התצוגה של הסיסמה
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(inputData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/login",
        inputData
      );
      console.log("Login successful:", response.data);

      const username = response.data.data.user.name;
      const isAdmin = response.data.data.user.isAdmin;
      const token = response.data.token;

      localStorage.setItem("username", username);
      localStorage.setItem("isAdmin", isAdmin);
      localStorage.setItem("token", token); // שמירת הטוקן

      setIsLoggedIn(true);
      setUsername(username);
      setIsAdmin(isAdmin);

      navigate("/");
    } catch (error) {
      // הדפסת לוג של השגיאה כדי להבין מה התקבל מהשרת
      console.error("Error response:", error.response);

      // בדיקה אם התקבלה תשובה מהשרת
      const serverMessage = error.response?.data?.message || "שגיאה בלתי צפויה. אנא נסה שוב.";

      // הצגת הודעות שגיאה מותאמות
      if (error.response?.status === 404 && serverMessage.includes("Email not found")) {
        alert("המייל שהוזן לא קיים במאגר. אנא נסה שוב.");
      } else if (error.response?.status === 400 && serverMessage.includes("Incorrect password")) {
        alert("הסיסמה שהוזנה שגויה. אנא נסה שוב.");
      } else {
        alert(serverMessage);
      }
    }
  };

  return (
    <div className="login-wrapper">
      <div className="container-login">
        <h2 className="title-login">להתחברות</h2>
        <form onSubmit={onSubmit} className="form-login">
          <div className="label-input-login">
            <span className="icon"><FaEnvelope /></span>
            <input
              type="email"
              name="email"
              placeholder="כתובת מייל"
              onChange={handleChange}
              required
            />
          </div>
          <div className="label-input-login">
            <span className="icon"><FaLock /></span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="סיסמא"
              onChange={handleChange}
              required
            />
            <span className="icon eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="btn-login">
            להתחברות
          </button>
        </form>
        <div className="navToRegister">
          <p className="login-link">
            עדיין לא רשום/ה? <Link to="/register">להרשמה</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
