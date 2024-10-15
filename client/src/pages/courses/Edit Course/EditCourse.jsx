import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditCourse.css'; // ייבוא קובץ ה-CSS

export default function EditCourse() {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseCapacity, setCourseCapacity] = useState(''); // שדה חדש לקיבולת
  const [courseStartDate, setCourseStartDate] = useState(''); // שדה חדש לתאריך התחלה
  const [courseImage, setCourseImage] = useState(null); // שדה עבור העלאת קובץ תמונה
  const [currentImage, setCurrentImage] = useState(''); // שמירה של התמונה הנוכחית
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}`);
        const { name, description, price, capacity, image, startDate } = response.data; // קבלת ערך הקיבולת, התמונה ותאריך ההתחלה מהשרת
        setCourseName(name);
        setCourseDescription(description);
        setCoursePrice(price);
        setCourseCapacity(capacity); // הגדרת הקיבולת
        setCourseStartDate(startDate ? new Date(startDate).toISOString().split('T')[0] : ''); // הגדרת תאריך התחלה לפורמט הנכון
        setCurrentImage(image); // הגדרת התמונה הנוכחית
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // הכנת הנתונים לשליחה
    const formData = {
      name: courseName,
      description: courseDescription,
      price: coursePrice,
      capacity: courseCapacity,
      startDate: courseStartDate, // שליחת תאריך ההתחלה
    };

    try {
      await axios.put(`http://localhost:3000/api/v1/courses/${courseId}`, formData, {
        headers: {
          'Content-Type': 'application/json', // בקשה עם תוכן JSON
        },
      });
      
      navigate('/courses');
    } catch (error) {
      console.error('Failed to edit course:', error);
    }
  };

  const handleImageChange = (e) => {
    setCourseImage(e.target.files[0]);
  };

  return (
    <div className="edit-course-wrapper">
      <div className="edit-course-container">
        <h1>עריכת קורס</h1>
        <form onSubmit={handleSubmit} className="edit-course-form">
          <div className="form-group">
            <label>שם הקורס:</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>פרטי הקורס:</label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>מחיר הקורס:</label>
            <input
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>קיבולת משתתפים:</label>
            <input
              type="number"
              value={courseCapacity}
              onChange={(e) => setCourseCapacity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>מועד תחילת הקורס:</label> {/* שדה חדש לתאריך תחילת הקורס */}
            <input
              type="date"
              value={courseStartDate}
              onChange={(e) => setCourseStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>תמונה נוכחית:</label>
            {currentImage && (
              <div className="current-image">
                <img src={`http://localhost:3000/${currentImage}`} alt="Current Course" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>עדכן תמונה חדשה:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-button">שמור שינויים</button>
        </form>
      </div>
    </div>
  );
}
