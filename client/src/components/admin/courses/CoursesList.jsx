import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './coursesList.css';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); // מצב לסינון, ריק כברירת מחדל
  const [showTable, setShowTable] = useState(false); // מצב להצגת הטבלה, ברירת מחדל false
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

  // פונקציה לחישוב הכנסות
  const calculateRevenue = (course) => {
    return course.participants * course.price;
  };

  // פונקציה לחישוב כמות המקומות הפנויים בקורס
  const calculateAvailableSpots = (course) => {
    return course.capacity - course.participants;
  };

  // סינון הקורסים לפי מצב
  const filteredCourses = courses.filter(course => {
    if (filter === 'available') {
      return course.participants < course.capacity; // קורסים עם מקומות פנויים
    } else if (filter === 'full') {
      return course.participants >= course.capacity; // קורסים מלאים
    } else {
      return true; // הצגת כל הקורסים
    }
  });

  // מיון לפי הכנסות (מהגבוה לנמוך)
  const sortedCourses = filteredCourses.sort((a, b) => calculateRevenue(b) - calculateRevenue(a));

  // פונקציה להצגת הטבלה לאחר לחיצה על כפתור
  const handleShowTable = (filterType) => {
    setFilter(filterType); // עדכון הסינון
    setShowTable(true); // הצגת הטבלה
  };

  return (
    <div className="courses-wrapper">
      <div className="courses-list">
        <h1>רשימת קורסים</h1>
        {error && <p className="error-message">{error}</p>}
        
        {/* כפתורים לסינון הקורסים */}
        <div className="filter-buttons">
          <button onClick={() => handleShowTable('all')}>הצג את כל הקורסים</button>
          <button onClick={() => handleShowTable('available')}>קורסים עם מקומות פנויים</button>
          <button onClick={() => handleShowTable('full')}>קורסים בתפוסה מלאה</button>
        </div>

        {/* הצגת הטבלה רק לאחר לחיצה על כפתור */}
        {showTable && (
          <table>
            <thead>
              <tr>
                <th>פעולות</th>
                <th>סטטוס</th>
                <th>הכנסות</th>
                <th>משתתפים</th>
                <th>תאריך יצירה</th>
                <th>תיאור בקצרה</th>
                <th>מחיר</th>
                <th>שם קורס</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <button onClick={() => handleEditCourse(course._id)}>ערוך</button> {/* שימוש בפונקציית עריכה */}
                    <button className="delete" onClick={() => handleDeleteCourse(course._id)}>מחק</button> {/* שימוש בפונקציית מחיקה */}
                  </td>
                  <td>
                    {/* בדיקה אם הקורס מלא והצגת הכיתוב */}
                    {course.participants >= course.capacity ? (
                      <span className="full-course">הקורס מלא</span>
                    ) : (
                      <span className="available-course">נשארו {calculateAvailableSpots(course)} מקומות</span>
                    )}
                  </td>
                  <td>{calculateRevenue(course)} ש"ח</td> {/* הצגת ההכנסות */}
                  <td>{course.participants} / {course.capacity}</td>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td>{course.description}</td>
                  <td>{course.price} ש"ח</td>
                  <td>{course.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
