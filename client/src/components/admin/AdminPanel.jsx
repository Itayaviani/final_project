import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]); // State for courses
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
        setError('Error fetching users');
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/courses');
        setCourses(response.data);
      } catch (err) {
        setError('Error fetching courses');
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
      setError('Error deleting user');
    }
  };

  const handleEditUser = (id) => {
    navigate(`/edit-user/${id}`); // Navigate to edit user page
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
    } catch (err) {
      setError('Error deleting course');
    }
  };

  const handleEditCourse = (id) => {
    navigate(`/edit-course/${id}`); // Navigate to edit course page
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <div className="category-container">

        {/* Users Section */}
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
                    <button onClick={() => handleEditUser(user._id)}>ערוך</button>
                    <button onClick={() => handleDeleteUser(user._id)}>מחק</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Courses Section */}
        <div className="category">
          <h2>קורסים</h2>
          {error && <p className="error-message">{error}</p>}
          <table>
            <thead>
              <tr>
                <th>שם קורס</th>
                <th>מחיר</th>
                <th>תיאור בקצרה</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course.name}</td>
                  <td>{course.price} ש"ח</td>
                  <td>{course.description}</td>
                  <td>
                    <button onClick={() => handleEditCourse(course._id)}>ערוך</button>
                    <button onClick={() => handleDeleteCourse(course._id)}>מחק</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
