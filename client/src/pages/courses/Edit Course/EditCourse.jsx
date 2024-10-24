import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditCourse.css'; // ייבוא קובץ ה-CSS

export default function EditCourse() {
  const { courseId } = useParams();
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDetails, setCourseDetails] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseCapacity, setCourseCapacity] = useState('');
  const [courseStartDate, setCourseStartDate] = useState('');
  const [courseStartTime, setCourseStartTime] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}`);
        const { name, courseDescription, courseDetails, price, capacity, image, startDate, startTime } = response.data;
        setCourseName(name);
        setCourseDescription(courseDescription);
        setCourseDetails(courseDetails);
        setCoursePrice(price);
        setCourseCapacity(capacity);
        setCourseStartDate(startDate ? new Date(startDate).toISOString().split('T')[0] : '');
        setCourseStartTime(startTime);
        setCurrentImage(image);
      } catch (error) {
        console.error('Failed to fetch course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', courseName);
    formData.append('courseDescription', courseDescription);
    formData.append('courseDetails', courseDetails);
    formData.append('price', coursePrice);
    formData.append('capacity', courseCapacity);
    formData.append('startDate', `${courseStartDate}T${courseStartTime}`);
    formData.append('startTime', courseStartTime);

    // עדכון התמונה רק אם הועלה תמונה חדשה
    if (courseImage) {
      formData.append('image', courseImage);
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/courses/${courseId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // יש לשנות ל multipart/form-data כדי לשלוח תמונה
        },
      });
      
      navigate('/courses'); // ניתוב חזרה לדף הקורסים לאחר השמירה
    } catch (error) {
      console.error('Failed to edit course:', error);
    }
  };

  const handleImageChange = (e) => {
    setCourseImage(e.target.files[0]); // עדכון התמונה החדשה
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
            <label>תיאור הקורס:</label>
            <textarea
              value={courseDescription}
              onChange={(e) => setCourseDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>פרטי הקורס:</label>
            <textarea
              value={courseDetails}
              onChange={(e) => setCourseDetails(e.target.value)}
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
            <label>מועד תחילת הקורס:</label>
            <input
              type="date"
              value={courseStartDate}
              onChange={(e) => setCourseStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>שעת תחילת הקורס:</label>
            <input
              type="time"
              value={courseStartTime}
              onChange={(e) => setCourseStartTime(e.target.value)}
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
