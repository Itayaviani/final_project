// src/pages/EditCourse.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditCourse() {
  const { courseId } = useParams(); // שימוש ב-useParams לקבלת ה-courseId מהנתיב
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseImage, setCourseImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}`);
        const { name, description, price, image } = response.data;
        setCourseName(name);
        setCourseDescription(description);
        setCoursePrice(price);
        setCourseImage(image);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // שליחת הנתונים בפורמט JSON
      await axios.put(`http://localhost:3000/api/v1/courses/${courseId}`, {
        name: courseName,
        description: courseDescription,
        price: coursePrice,
        image: courseImage, // לשמור את השדה הזה אם הוא קיים
      });
      
      navigate('/courses');
    } catch (error) {
      console.error('Failed to edit course:', error);
    }
  };

  const handleImageChange = (e) => {
    setCourseImage(e.target.value); // עדכון השדה של התמונה אם אתה שומר אותו כטקסט
  };

  return (
    <div className="edit-course-container">
      <h1>עריכת קורס</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם הקורס:</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>פרטי הקורס:</label>
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>מחיר הקורס:</label>
          <input
            type="number"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תמונה לקורס:</label>
          <input
            type="text"
            value={courseImage}
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">שמור שינויים</button>
      </form>
    </div>
  );
}
