import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ייבוא useNavigate
import './coursesList.css';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // הגדרת navigate

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/courses');
        setCourses(response.data);
      } catch (err) {
        setError('שגיאה בטעינת הקורסים');
      }
    };

    fetchCourses();
  }, []);

  // פונקציה למחיקת קורס
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id)); // עדכון הסטייט לאחר המחיקה
    } catch (err) {
      setError('שגיאה במחיקת הקורס');
    }
  };

  // פונקציה לעריכת קורס
  const handleEditCourse = (id) => {
    navigate(`/edit-course/${id}`); // ניווט לדף עריכת הקורס
  };

  return (
    <div className="courses-wrapper">
      <div className="courses-list">
        <h1>רשימת קורסים</h1>
        {error && <p className="error-message">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>שם קורס</th>
              <th>מחיר</th>
              <th>תיאור בקצרה</th>
              <th>תאריך יצירה</th>
              <th>משתתפים</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.price} ש"ח</td>
                <td>{course.description}</td>
                <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                <td>{course.participants} / {course.capacity}</td>
                <td>
                  <button onClick={() => handleEditCourse(course._id)}>ערוך</button> {/* שימוש בפונקציית עריכה */}
                  <button className="delete" onClick={() => handleDeleteCourse(course._id)}>מחק</button> {/* שימוש בפונקציית מחיקה */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesList;
