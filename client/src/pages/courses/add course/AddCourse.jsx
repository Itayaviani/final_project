import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCourse.css'; // ייבוא קובץ ה-CSS

export default function AddCourse({ addCourse }) {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState(''); // שדה עבור תיאור הקורס (תיאור קצר)
  const [courseDetails, setCourseDetails] = useState(''); // שדה עבור פרטי הקורס (תיאור מפורט)
  const [coursePrice, setCoursePrice] = useState('');
  const [courseCapacity, setCourseCapacity] = useState(''); // שדה עבור הקיבולת
  const [courseImage, setCourseImage] = useState(null);
  const [courseStartDate, setCourseStartDate] = useState(''); // שדה עבור מועד תחילת הקורס
  const [courseStartTime, setCourseStartTime] = useState(''); // שדה עבור שעת תחילת הקורס
  const [error, setError] = useState(null); // לניהול שגיאות
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // איפוס שגיאות קודמות

    try {
      // יצירת FormData והוספת כל השדות הרלוונטיים
      const formData = new FormData();
      formData.append('name', courseName);
      formData.append('courseDescription', courseDescription); // הוספת תיאור הקורס (תיאור קצר)
      formData.append('courseDetails', courseDetails); // הוספת פרטי הקורס (תיאור מפורט)
      formData.append('price', coursePrice);
      formData.append('capacity', courseCapacity); // הוספת קיבולת
      formData.append('startDate', `${courseStartDate}T${courseStartTime}`); // הוספת מועד התחלה עם השעה
      formData.append('startTime', courseStartTime); // הוספת שעת התחלה

      // הדפסות בקונסול
      console.log('courseName:', courseName);
      console.log('courseDescription:', courseDescription);
      console.log('courseDetails:', courseDetails);
      console.log('coursePrice:', coursePrice);
      console.log('courseCapacity:', courseCapacity);
      console.log('courseStartDate:', courseStartDate);
      console.log('courseStartTime:', courseStartTime);

      if (courseImage) {
        formData.append('image', courseImage); // הוספת תמונה
        console.log('courseImage:', courseImage.name); // הצגת שם התמונה בקונסול
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
          <label>:שם הקורס</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:תיאור הקורס</label> {/* שדה עבור תיאור הקורס (תיאור קצר) */}
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="תיאור קצר של הקורס"
            required
          ></textarea>
        </div>
        <div>
          <label>:פרטי הקורס</label> {/* שדה עבור פרטי הקורס (תיאור מפורט) */}
          <textarea
            value={courseDetails}
            onChange={(e) => setCourseDetails(e.target.value)}
            placeholder="פרטים מלאים על הקורס"
            required
          ></textarea>
        </div>
        <div>
          <label>:מחיר הקורס</label>
          <input
            type="number"
            value={coursePrice}
            onChange={(e) => setCoursePrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:קיבולת משתתפים</label>
          <input
            type="number"
            value={courseCapacity}
            onChange={(e) => setCourseCapacity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:מועד תחילת הקורס</label> {/* שדה עבור מועד תחילת הקורס */}
          <input
            type="date"
            value={courseStartDate}
            onChange={(e) => setCourseStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:שעת תחילת הקורס</label> {/* שדה עבור שעת תחילת הקורס */}
          <input
            type="time"
            value={courseStartTime}
            onChange={(e) => setCourseStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:תמונה לקורס</label>
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
