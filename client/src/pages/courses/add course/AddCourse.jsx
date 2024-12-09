import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddCourse.css';

export default function AddCourse({ addCourse }) {
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState(''); 
  const [courseDetails, setCourseDetails] = useState(''); 
  const [coursePrice, setCoursePrice] = useState('');
  const [courseCapacity, setCourseCapacity] = useState(''); 
  const [courseImage, setCourseImage] = useState(null);
  const [courseStartDate, setCourseStartDate] = useState(''); 
  const [courseStartTime, setCourseStartTime] = useState(''); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 

    try {

      const formData = new FormData();
      formData.append('name', courseName);
      formData.append('courseDescription', courseDescription); 
      formData.append('courseDetails', courseDetails); 
      formData.append('price', coursePrice);
      formData.append('capacity', courseCapacity); 
      formData.append('startDate', `${courseStartDate}T${courseStartTime}`); 
      formData.append('startTime', courseStartTime); 

      
      console.log('courseName:', courseName);
      console.log('courseDescription:', courseDescription);
      console.log('courseDetails:', courseDetails);
      console.log('coursePrice:', coursePrice);
      console.log('courseCapacity:', courseCapacity);
      console.log('courseStartDate:', courseStartDate);
      console.log('courseStartTime:', courseStartTime);

      if (courseImage) {
        formData.append('image', courseImage); 
        console.log('courseImage:', courseImage.name); 
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

      addCourse(response.data);
      navigate('/courses');
    } catch (error) {
      console.error('הוספת הקורס נכשלה:', error.response ? error.response.data : error.message);
      setError('הוספת הקורס נכשלה. אנא בדוק את הטופס ונסה שוב.'); 
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
          <label>:שם הקורס</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:תיאור הקורס</label> 
          <textarea
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="תיאור קצר של הקורס"
            required
          ></textarea>
        </div>
        <div>
          <label>:פרטי הקורס</label>
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
          <label>:מועד תחילת הקורס</label> 
          <input
            type="date"
            value={courseStartDate}
            onChange={(e) => setCourseStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:שעת תחילת הקורס</label> 
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
      {error && <p className="error-message">{error}</p>} 
    </div>
  );
}
