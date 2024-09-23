import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './courseDetails.css'; // ייבוא קובץ ה-CSS לעיצוב


export default function CourseDetails() {
  const { courseId } = useParams(); // שימוש ב-useParams לקבלת ה-courseId מהנתיב
  const [course, setCourse] = useState(null);
  const [purchaseMessage, setPurchaseMessage] = useState(''); // הודעה לרכישה
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

   // פונקציה לניתוב לעמוד התשלום
   const handlePurchase = () => {
    navigate(`/payment/courses/${courseId}`);
  };

  if (!course) {
    return <p>טוען פרטים...</p>;
  }

  return (
    <div className="course-details-container">
      <h1>שם: {course.name}</h1>
      {course.image && <img src={`http://localhost:3000/${course.image}`} alt={course.name} className="course-image" />}
      <p>{course.description}</p>
      <p>מחיר: {course.price} ש"ח</p>
      
      {/* הוספת כפתור לרכישה */}
      <button onClick={handlePurchase} className="purchase-button">רכוש קורס</button>

      {/* הצגת הודעת רכישה */}
      {purchaseMessage && <p>{purchaseMessage}</p>}
    </div>
  );
}
