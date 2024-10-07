import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
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
        setError('שגיאה בטעינת משתמשים');
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/courses');
        setCourses(response.data);
      } catch (err) {
        setError('שגיאה בטעינת קורסים');
      }
    };

    fetchUsers();
    fetchCourses();
  }, []);

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

  const handleEditUser = (id) => {
    navigate(`/edit-user/${id}`);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
    } catch (err) {
      setError('שגיאה במחיקת הקורס');
    }
  };

  const handleEditCourse = (id) => {
    navigate(`/edit-course/${id}`);
  };

  return (
    <div className="admin-panel-wrapper">
      <div className="admin-panel">
        <h1>לוח ניהול</h1>
        <div className="category-container">
          <button onClick={() => navigate('/users')}>משתמשים</button>
          <button onClick={() => navigate('/admin/coursesList')}>קורסים</button>
          <button onClick={() => navigate('/admin/inquiries')}>פניות צור קשר</button>
          <button onClick={() => navigate('/admin/workshopsList')}>סדנאות</button>
          <button onClick={() => navigate('/admin/purchases')}>רכישות</button> {/* כפתור חדש לרכישות */}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
