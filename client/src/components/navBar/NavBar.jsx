import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navBar.css";

export default function NavBar({ isLoggedIn, username, isAdmin, onLogout }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : '');
    return initials.toUpperCase();
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          {isLoggedIn ? (
            <>
              <li className="navbar-item" onClick={() => navigate('/profile')}>
                <div className="user-icon">{getInitials(username)}</div>
                {username}
              </li>
              <li className="navbar-item navbar-item-login" onClick={onLogout}>
                התנתקות
              </li>
            </>
          ) : (
            <li className="navbar-item navbar-item-login" onClick={() => navigate("/login")}>
              התחברות
            </li>
          )}
          <li className="navbar-item" onClick={() => navigate("/")}>
            דף בית
          </li>
          <li className="navbar-item" onClick={() => navigate("/feminineLook")}>
            מבט נשי
          </li>
          <li className="navbar-item" onClick={() => navigate("/niceToMeet")}>
            נעים להכיר
          </li>
          <li className="navbar-item" onClick={() => navigate("/personalProcess")}>
            תהליך אישי
          </li>
          <li className="navbar-item" onClick={() => navigate("/communitiesAndOrganizations")}>
            קהילות וארגונים
          </li>
          <li className="navbar-item" onClick={() => navigate("/courses")}>
            קורסים
          </li>
          <li className="navbar-item" onClick={() => navigate("/workshops")}>
            סדנאות
          </li>
          <li className="navbar-item" onClick={() => navigate("/projects")}>
            הצצה לפרויקטים
          </li>
          <li className="navbar-item" onClick={() => navigate("/contactUs")}>
            צור קשר
          </li>
          {isAdmin && (
            <li className="navbar-item" onClick={() => navigate("/admin")}>
              Admin Panel
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
