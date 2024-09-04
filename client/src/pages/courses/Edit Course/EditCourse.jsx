import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditCourse.css'; // Import the CSS file

export default function EditCourse() {
  const { courseId } = useParams();
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
      await axios.put(`http://localhost:3000/api/v1/courses/${courseId}`, {
        name: courseName,
        description: courseDescription,
        price: coursePrice,
        image: courseImage,
      });
      
      navigate('/courses');
    } catch (error) {
      console.error('Failed to edit course:', error);
    }
  };

  const handleImageChange = (e) => {
    setCourseImage(e.target.value);
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
            <label>תמונה לקורס:</label>
            <input
              type="text"
              value={courseImage}
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-button">שמור שינויים</button>
        </form>
      </div>
    </div>
  );
}
