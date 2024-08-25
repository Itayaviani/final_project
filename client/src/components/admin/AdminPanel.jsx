import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // שימוש ב-useNavigate לניווט

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data.users);
      } catch (err) {
        setError('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      setError('Error deleting user');
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-user/${id}`); // הפניה לדף עריכת המשתמש
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="category-container">
        <div className="category">
          <h2>משתמשים</h2>
          {error && <p className="error-message">{error}</p>}
          <table>
            <thead>
              <tr>
                <th>שם משתמש</th>
                <th>מספר פלאפון</th>
                <th>אימייל</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => handleEdit(user._id)}>ערוך</button>
                    <button onClick={() => handleDelete(user._id)}>מחק</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="category">
          <h2>קורסים</h2>
          <table>
            <thead>
              <tr>
                <th>שם קורס</th>
                <th>כמות רוכשים</th>
              </tr>
            </thead>
            <tbody>
              {/* הוספת שורות של קורסים כאן */}
              <tr>
                <td>קורס לדוגמה</td>
                <td>10</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="category">
          <h2>סדנאות</h2>
          <table>
            <thead>
              <tr>
                <th>שם סדנא</th>
                <th>כמות רוכשים</th>
              </tr>
            </thead>
            <tbody>
              {/* הוספת שורות של סדנאות כאן */}
              <tr>
                <td>סדנא לדוגמה</td>
                <td>5</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="category">
          <h2>תהליכים אישיים</h2>
          <table>
            <thead>
              <tr>
                <th>שם תהליך</th>
                <th>כמות רוכשים</th>
              </tr>
            </thead>
            <tbody>
              {/* הוספת שורות של תהליכים אישיים כאן */}
              <tr>
                <td>תהליך לדוגמה</td>
                <td>3</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="category">
          <h2>רכישות</h2>
          <table>
            <thead>
              <tr>
                <th>כמות רכישות</th>
                <th>איזה משתמש רכש מה</th>
              </tr>
            </thead>
            <tbody>
              {/* הוספת שורות של רכישות כאן */}
              <tr>
                <td>7</td>
                <td>משתמש לדוגמה רכש קורס לדוגמה</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
