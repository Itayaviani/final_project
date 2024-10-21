import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({}); // State for user data
  const [error, setError] = useState(''); // State for errors
  const navigate = useNavigate(); // useNavigate hook for navigation

  // Fetch the logged-in user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from local storage
        const response = await axios.get(
          'http://localhost:3000/api/v1/users/me',
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the headers
            },
          }
        );

        // Update state with user data
        setUser(response.data.data.user);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('שגיאה בטעינת פרופיל המשתמש'); // Display an error message
      }
    };

    fetchProfile(); // Fetch user profile on component mount
  }, []);

  // Handle navigation to purchases page
  const handleViewPurchases = () => {
    navigate('/my-purchases'); // Navigate to /my-purchases
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
        <h1>:פרופיל משתמש</h1>
        <div className="profile-details">
          <p><span className="value">{user.name}</span> <span className="label">:שם מלא</span></p>
          <p><span className="value">{user.email}</span> <span className="label">:אימייל</span></p>
          <p><span className="value">{user.phone}</span> <span className="label">:טלפון</span></p>
        </div>

        <div className="button-container">
          {/* Edit profile button */}
          <Link to={`/edit-user/${user._id}`} className="edit-profile-button">
            ערוך פרופיל
          </Link>

          {/* View purchases button */}
          <button onClick={handleViewPurchases} className="view-purchases-button">
            הרכישות שלי
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
