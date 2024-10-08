import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

export default function Login({ setIsLoggedIn, setUsername, setIsAdmin }) {
  const [inputData, setInputData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
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
      localStorage.setItem("token", token); // Save the token

      setIsLoggedIn(true);
      setUsername(username);
      setIsAdmin(isAdmin);

      navigate("/");
    } catch (error) {
      console.error(
        "Error logging in:",
        error.response?.data?.message || error.message
      );
      setErrorMessage("Email or password is incorrect. Please try again.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="container-login">
        <h2 className="title-login">התחברות</h2>
        <form onSubmit={onSubmit} className="form-login">
          <div className="label-input-login">
            <label htmlFor="email"></label>
            <input
              type="email"
              name="email"
              placeholder="כתובת מייל"
              onChange={handleChange}
              required
            />
          </div>
          <div className="label-input-login">
            <label htmlFor="password"></label>
            <input
              type="password"
              name="password"
              placeholder="סיסמא"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn-login">
            להתחברות
          </button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="navToRegister">
          <p className="login-link">
            עדיין לא רשום/ה? <Link to="/register">להרשמה</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
