import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Courses({ courses }) {  // קבלת רשימת הקורסים כפרופס
  const isAdmin = true;  // בדיקת האם המשתמש הוא אדמין
  const navigate = useNavigate();

  return (
    <div>
      <h1>קורסים</h1>
      {isAdmin && (
        <button onClick={() => navigate('/add-course')}>הוספת קורס</button>
      )}
      <div>
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} style={{ border: '1px solid black', padding: '10px', margin: '10px' }}>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <p>מחיר: {course.price} ש"ח</p>
              {course.image && (
                <img src={URL.createObjectURL(course.image)} alt={course.name} style={{ maxWidth: '200px' }} />
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
