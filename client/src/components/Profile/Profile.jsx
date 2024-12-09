import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({}); 
  const [error, setError] = useState('');
  const navigate = useNavigate(); 


  useEffect(() => {
    // פונקציה לאחזור נתוני הפרופיל של המשתמש
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        //אחזור נתוני המשתמש המחובר 
        const response = await axios.get(
          'http://localhost:3000/api/v1/users/me',
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        
        setUser(response.data.data.user);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('שגיאה בטעינת פרופיל המשתמש'); 
      }
    };

    fetchProfile(); 
  }, []);

  // פונקציה לניווט לעמוד הרכישות
  const handleViewPurchases = () => {
    navigate('/my-purchases'); 
  };

  if (error) {
    return (
      <div className="profile-wrapper">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1 className="profile-title">:פרופיל משתמש</h1> 
        <div className="profile-details">
          <p><span className="value">{user.name}</span> <span className="label">:שם מלא</span></p>
          <p><span className="value">{user.email}</span> <span className="label">:אימייל</span></p>
          <p><span className="value">{user.phone}</span> <span className="label">:טלפון</span></p>
        </div>

        <div className="button-container">
          
          <Link to={`/edit-user/${user._id}`} className="edit-profile-button">
            ערוך פרופיל
          </Link>

          
          <button onClick={handleViewPurchases} className="view-purchases-button">
            הרכישות שלי
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
