import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./register.css";

export default function Register() {
  const [inputData, setInputData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/register",
        inputData
      );
      console.log('Registration successful:', response.data);

      // ניתוב לדף התחברות לאחר ההרשמה
      // navigate('/login'); // תחליף את '/login' לדף שאליו אתה רוצה לנווט
    } catch (error) {
      console.error('Error during registration:', error.response?.data?.message || error.message);
      setErrorMessage('Error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="container-register">
      <h2 className="title-register">הרשמה</h2>
      <form onSubmit={handleSubmit} className="form-register">
        <div className="label-input-register">
          <label htmlFor="name"></label>
          <input
            type="text"
            name="name"
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
            onChange={handleChange}
            placeholder="סיסמא"
            required
          />
        </div>
        <button type="submit" className="btn-register">להרשמה</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="navToLogin">
        <p className="register-link">
          כבר רשום/ה?
          <Link to="/login">להתחברות</Link>
        </p>
      </div>
    </div>
  );
}
