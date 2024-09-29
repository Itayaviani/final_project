import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './userList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        setError('שגיאה בטעינת המשתמשים');
      }
    };

    fetchUsers();
  }, []);

  // פונקציה למחיקת משתמש
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      setError('שגיאה במחיקת המשתמש');
    }
  };

  // פונקציה לעריכת משתמש
  const handleEditUser = (id) => {
    navigate(`/edit-user/${id}`); // ניווט לדף עריכת המשתמש
  };

  return (
    <div className="user-list">
      <h1>רשימת משתמשים</h1>
      {error && <p className="error-message">{error}</p>}
      <table>
        <thead>
          <tr>
            <th>שם משתמש</th>
            <th>מספר פלאפון</th>
            <th>אימייל</th>
            <th>פעולות</th> {/* עמודת הפעולות */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEditUser(user._id)}>ערוך</button> {/* כפתור לעריכת משתמש */}
                <button onClick={() => handleDeleteUser(user._id)}>מחק</button> {/* כפתור למחיקת משתמש */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
