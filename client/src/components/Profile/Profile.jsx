import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate(); // הוספת useNavigate כדי לנווט לעמוד אחר

  // משיכת פרטי המשתמש
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data.user);
      } catch (err) {
        setError('Error fetching profile');
      }
    };
    fetchProfile();
  }, []);

  if (error) {
    return <div className="profile-wrapper"><div className="error-message">{error}</div></div>;
  }

  // פונקציה לנווט לעמוד הרכישות
  const handleViewPurchases = () => {
    navigate('/my-purchases');
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1>פרופיל משתמש</h1>
        <div className="profile-details">
          <p>שם מלא: {user.name}</p>
          <p>אימייל: {user.email}</p>
          <p>טלפון: {user.phone}</p>
        </div>

        {/* כפתור עריכת פרופיל */}
        <Link to={`/edit-user/${user._id}`} className="edit-profile-button">
          ערוך פרופיל
        </Link>

        {/* כפתור לצפייה ברכישות */}
        <button onClick={handleViewPurchases} className="view-purchases-button">
          הרכישות שלי
        </button>
      </div>
    </div>
  );
};

export default Profile;
