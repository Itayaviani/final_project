import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCourse.css'; // ייבוא קובץ ה-CSS

export default function AddCourse({ addCourse }) {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseCapacity, setCourseCapacity] = useState(''); // שדה עבור הקיבולת
  const [courseImage, setCourseImage] = useState(null);
  const [courseStartDate, setCourseStartDate] = useState(''); // שדה עבור מועד תחילת הקורס
  const [error, setError] = useState(null); // לניהול שגיאות
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // איפוס שגיאות קודמות

    try {
      // יצירת FormData והוספת כל השדות הרלוונטיים
      const formData = new FormData();
      formData.append('name', courseName);
      formData.append('description', courseDescription);
      formData.append('price', coursePrice);
      formData.append('capacity', courseCapacity); // הוספת קיבולת
      formData.append('startDate', courseStartDate); // הוספת מועד התחלה
      if (courseImage) {
        formData.append('image', courseImage); // הוספת תמונה
      }

      const response = await axios.post(
        'http://localhost:3000/api/v1/courses',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      addCourse(response.data); // עדכון המצב עם הקורס החדש
      navigate('/courses'); // ניווט לרשימת הקורסים לאחר ההוספה
    } catch (error) {
      console.error('Failed to add course:', error.response ? error.response.data : error.message);
      setError('Failed to add course. Please check the form and try again.'); // הצגת הודעת שגיאה
    }
  };

  const handleImageChange = (e) => {
    setCourseImage(e.target.files[0]); // טיפול בשינוי התמונה
  };

  return (
    <div className="add-course-container">
      <h1>הוספת קורס חדש</h1>
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
          <label>קיבולת משתתפים:</label>
          <input
            type="number"
            value={courseCapacity}
            onChange={(e) => setCourseCapacity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>מועד תחילת הקורס:</label> {/* שדה עבור מועד תחילת הקורס */}
          <input
            type="date"
            value={courseStartDate}
            onChange={(e) => setCourseStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תמונה לקורס:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">הוסף קורס</button>
      </form>
      {error && <p className="error-message">{error}</p>} {/* הצגת שגיאה אם קיימת */}
    </div>
  );
}
