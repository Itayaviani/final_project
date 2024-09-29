import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({});
  const [error, setError] = useState('');

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

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h1>פרופיל משתמש</h1>
        <div className="profile-details">
          <p>שם מלא: {user.name}</p>
          <p>אימייל: {user.email}</p>
          <p>טלפון: {user.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
