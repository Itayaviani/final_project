import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Courses({ isAdmin }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  console.log("is admin : " , isAdmin)
  return (
    <div>
      <h1>קורסים</h1>

      {/* הצגת כפתור הוספת הקורס רק אם המשתמש הוא אדמין */}
      {isAdmin && (
        <div>
          <Link to="/add-course">
            <button>הוסף קורס חדש</button>
          </Link>
        </div>
      )}

      <div>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p>מחיר: {course.price} ש"ח</p>
              {course.image && (
                <img src={course.image} alt={course.name} style={{ maxWidth: '200px' }} />
              )}
            </div>
          ))
        ) : (
          <p>אין קורסים להצגה</p>
        )}
      </div>
    </div>
  );
}
