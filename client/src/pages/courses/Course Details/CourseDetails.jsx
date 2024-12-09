import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './courseDetails.css';

export default function CourseDetails() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchCourse = async () => {
      try {

        const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        console.error('שליפת פרטי הקורס נכשלה:', error);
      }
    };

    fetchCourse();
  }, [courseId]);//הפונקציה תתבצע מחדש רק עם יהיה שינוי במזהה הקורס


  const handlePurchase = () => {
    navigate(`/payment/courses/${courseId}`);
  };


  const splitTextIntoParagraphs = (text) => {
    const words = text.split(' ');
    const paragraphs = [];
    for (let i = 0; i < words.length; i += 200) {
      const paragraph = words.slice(i, i + 200).join(' ').trim();
      if (paragraph) { 
        paragraphs.push(paragraph);
      }
    }
    return paragraphs;
  };


  if (!course) {
    return <p>טוען פרטים...</p>;
  }


  const detailsParagraphs = splitTextIntoParagraphs(course.courseDetails || '');

  return (
    <div className="course-details-container">
      <h1>שם הקורס: {course.name}</h1>
      {course.image && (
        <img src={`http://localhost:3000/${course.image}`} alt={course.name} className="course-image" />
      )}
      
      {/* הצגת פרטי הקורס במקטעים */}
      <div className="course-text-section">
        {detailsParagraphs.map((paragraph, index) => (
          <div key={`details-${index}`} className="course-text-box">
            <p>{paragraph}</p>
          </div>
        ))}
      </div>

      <p>מחיר: {course.price} ש"ח</p>
      
      <button onClick={handlePurchase} className="purchase-button">רכוש קורס</button>
    </div>
  );
}
