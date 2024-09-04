import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCourse.css'; // ייבוא קובץ ה-CSS

export default function AddCourse({ addCourse }) {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [coursePrice, setCoursePrice] = useState('');
  const [courseImage, setCourseImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(courseName, courseDescription, coursePrice, courseImage);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/courses',
        { name: courseName, description: courseDescription, price: coursePrice, image: courseImage }
      );

      addCourse(response.data);

      navigate('/courses');
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  const handleImageChange = (e) => {
    setCourseImage(e.target.files[0]);
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
          <label>תמונה לקורס:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">הוסף קורס</button>
      </form>
    </div>
  );
}
