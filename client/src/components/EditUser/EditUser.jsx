import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditUser.css';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.data) {
          setUser(response.data.data); // עדכון נכון של המשתמש
        } else {
          setError('User data not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Error fetching user details');
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:3000/api/v1/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/admin');
    } catch (err) {
      setError('Error updating user details');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="edit-user-container">
      <div className="edit-user-form-container">
        <h2>עריכת משתמש</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>שם משתמש:</label>
            <input type="text" name="name" value={user.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>מספר פלאפון:</label>
            <input type="text" name="phone" value={user.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>אימייל:</label>
            <input type="email" name="email" value={user.email} onChange={handleChange} required />
          </div>
          <button type="submit">שמור</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
