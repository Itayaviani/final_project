import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditUser.css';

const EditUser = ({ setUsername }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/api/v1/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data.user); 
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

      localStorage.setItem('username', user.name);
      setUsername(user.name);

      setSuccess('!פרטי המשתמש עודכנו בהצלחה');
      setError('');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (err) {
      setError('Error updating user details');
      setSuccess('');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-user-container">
      <div className="edit-user-form-container">
        <h2>:עריכת פרטי משתמש</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
          <input type="text" name="phone" value={user.phone} onChange={handleChange} required />
            <label>מספר פלאפון:</label>
          </div>
          <div className="form-group">
          <input type="text" name="name" value={user.name} onChange={handleChange} required />
            <label>שם משתמש:</label>  
          </div>
          <button type="submit">שמור</button>
          <div className="form-group">
          <input type="email" name="email" value={user.email} onChange={handleChange} required />
            <label>אימייל:</label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
