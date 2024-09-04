// src/pages/CourseDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default function CourseDetails() {
  const { courseId } = useParams(); // שימוש ב-useParams לקבלת ה-courseId מהנתיב
  const [course, setCourse] = useState(null);

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

  if (!course) {
    return <p>טוען פרטים...</p>;
  }

  return (
    <div className="course-details-container">
      <h1>{course.name}</h1>
      {course.image && <img src={course.image} alt={course.name} />}
      <p>{course.description}</p>
      <p>מחיר: {course.price} ש"ח</p>
    </div>
  );
}
