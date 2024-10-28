import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Courses.css"; // ייבוא קובץ ה-CSS

export default function Courses({ isAdmin, userId }) {
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]); // ניהול מצב של הקורסים שנרכשו
  const [loading, setLoading] = useState(true); // הוספת מצב טעינה

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/courses"
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setLoading(false); // להפסיק את מצב הטעינה לאחר קבלת הנתונים
      }
    };

    fetchCourses();
  }, [isAdmin]);

  // בדיקת הקורסים שנרכשו על ידי המשתמש הנוכחי
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/users/${userId}/purchases`
        );
        setPurchasedCourses(response.data.purchasedCourses);
      } catch (error) {
        console.error("Failed to fetch purchased courses:", error);
      }
    };

    if (userId) {
      fetchPurchasedCourses();
    }
  }, [userId]);

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error("Failed to delete course:", error);
    }
  };

  const handleEdit = (courseId) => {
    window.location.href = `/edit-course/${courseId}`;
  };

  const handleDetails = (courseId) => {
    window.location.href = `/course-details/${courseId}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); // התאמה להשוואה לפי תאריך בלבד ללא שעות

  const allCourses = courses.map((course) => {
    const startDate = new Date(course.startDate);
    startDate.setHours(0, 0, 0, 0); // התאמה להשוואה לפי תאריך בלבד ללא שעות
    const isPurchased = purchasedCourses
      .map(String)
      .includes(String(course._id)); // בדיקה אם הקורס נרכש
    const hasCourseStarted = startDate <= today; // בדיקה אם הקורס התחיל

    return {
      ...course,
      isPurchased,
      hasCourseStarted, // אם הקורס התחיל
      isFull: course.participants >= course.capacity, // בדיקה אם הקורס מלא
    };
  });

  if (loading) {
    return <div>טוען קורסים...</div>; // חיווי טעינה
  }

  return (
    <div>
      
      {/* הצגת כפתור הוספת הקורס רק אם המשתמש הוא אדמין */}
      {isAdmin && (
        <div className="add-course-button-container">
          <Link to="/add-course" className="add-course-button">
            הוסף קורס חדש
          </Link>
        </div>
      )}

      <div className="courses-container">
        {allCourses.length > 0 ? (
          allCourses.map((course) => (
            <div
              key={course._id}
              className={`course-card ${course.isPurchased ? "purchased" : ""}`}
            >
              <h3>{course.name}</h3>
              {course.image && (
                <img
                  src={`http://localhost:3000/${course.image}`}
                  alt={course.name}
                />
              )}
              <p>{course.courseDescription}</p> {/* הצגת תיאור הקורס */}
              <p className="price">מחיר: {course.price} ש"ח</p>

              {course.isFull && course.hasCourseStarted ? (
                <div>
                  <span className="full-label">קורס זה מלא</span>
                  <span className="started-label">קורס זה התחיל</span>
                </div>
              ) : course.isFull ? (
                <span className="full-label">קורס זה מלא</span>
              ) : course.hasCourseStarted ? (
                <span className="started-label">קורס זה התחיל</span>
              ) : null}

              <button
                onClick={() => handleDetails(course._id)}
                className="details-button"
              >
                פרטים נוספים
              </button>

              {/* הצגת מספר המשתתפים ותאריך יצירת הקורס רק אם המשתמש הוא אדמין */}
              {isAdmin && (
                <div>
                  <p className="participants">
                    משתתפים בקורס: {course.participants} מתוך {course.capacity}
                  </p>
                  <p className="creation-date">
                    נפתח בתאריך:{" "}
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* הצגת מועד ושעת תחילת הקורס לכל המשתמשים */}
              <p className="start-date">
                מועד תחילת הקורס:{" "}
                {course.startDate
                  ? new Date(course.startDate).toLocaleDateString()
                  : "לא נקבע תאריך"}
              </p>
              <p className="start-time">
                שעת תחילת הקורס:{" "}
                {course.startDate
                  ? new Date(course.startDate).toLocaleTimeString('he-IL', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : "לא נקבעה שעה"}
              </p>

              {/* הצגת כפתורי עריכה ומחיקה רק אם המשתמש הוא אדמין */}
              {isAdmin && (
                <div className="course-actions">
                  <button
                    onClick={() => handleEdit(course._id)}
                    className="edit-button"
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="delete-button"
                  >
                    מחק
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>אין קורסים להצגה</p>
        )}
      </div>
    </div>
  );
}
