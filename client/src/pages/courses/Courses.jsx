import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Courses.css'; // ייבוא קובץ ה-CSS

export default function Courses({ isAdmin, userId }) { 
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]); // ניהול מצב של הקורסים שנרכשו

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/courses');
        
        // לא מסננים קורסים מלאים כדי שכולם יוצגו
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [isAdmin]);

  // בדיקת הקורסים שנרכשו על ידי המשתמש הנוכחי
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}/purchases`);
        console.log('קורסים שנרכשו התקבלו:', response.data.purchasedCourses);
        setPurchasedCourses(response.data.purchasedCourses);
      } catch (error) {
        console.error('Failed to fetch purchased courses:', error);
      }
    };

    if (userId) {
      fetchPurchasedCourses();
    }
  }, [userId]);

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const handleEdit = (courseId) => {
    window.location.href = `/edit-course/${courseId}`;
  };

  const handleDetails = (courseId) => {
    window.location.href = `/course-details/${courseId}`;
  };

  return (
    <div>
      <h1>קורסים</h1>

      {/* הצגת כפתור הוספת הקורס רק אם המשתמש הוא אדמין */}
      {isAdmin && (
        <div className="add-course-button-container">
          <Link to="/add-course" className="add-course-button">
            הוסף קורס חדש
          </Link>
        </div>
      )}

      <div className="courses-container">
        {courses.length > 0 ? (
          courses.map((course) => {
            const isPurchased = purchasedCourses.map(String).includes(String(course._id)); // בדוק אם המשתמש רכש את הקורס
            const isFull = course.participants >= course.capacity; // בדיקה אם הקורס מלא

            // הוספת console.log לבדוק ערכים
            console.log('קורס ID:', course._id);
            console.log('קורסים שנרכשו:', purchasedCourses);
            console.log('האם נרכש:', isPurchased);

            return (
              <div key={course._id} className={`course-card ${isPurchased ? 'purchased' : ''}`}>
                <h3>{course.name}</h3>
                {course.image && (
                  <img src={`http://localhost:3000/${course.image}`} alt={course.name} />
                )}
                <p>{course.description}</p>
                <p className="price">מחיר: {course.price} ש"ח</p>

                {/* הצגת תווית "מלא" אם אין מקום פנוי */}
                {isFull && <span className="full-label">מלא</span>}

                {/* הצגת מספר המשתתפים רק אם המשתמש הוא אדמין */}
                {isAdmin && (
                  <div>
                    <p className="participants">משתתפים בקורס: {course.participants} מתוך {course.capacity}</p>
                    <p className="creation-date">נפתח בתאריך: {new Date(course.createdAt).toLocaleDateString()}</p>
                    <p className="start-date">מועד תחילת הקורס: {course.startDate ? new Date(course.startDate).toLocaleDateString() : 'לא נקבע תאריך'}</p> {/* מועד תחילת הקורס */}
                  </div>
                )}

                <button onClick={() => handleDetails(course._id)} className="details-button">פרטים נוספים</button>
                
                {/* הצגת כפתורי עריכה ומחיקה רק אם המשתמש הוא אדמין */}
                {isAdmin && (
                  <div className="course-actions">
                    <button onClick={() => handleEdit(course._id)} className="edit-button">ערוך</button>
                    <button onClick={() => handleDelete(course._id)} className="delete-button">מחק</button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>אין קורסים להצגה</p>
        )}
      </div>
    </div>
  );
}
