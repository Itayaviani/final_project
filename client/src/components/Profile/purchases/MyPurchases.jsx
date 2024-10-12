import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPurchases = ({ userId }) => {
  const [purchases, setPurchases] = useState([]); // מצב הרכישות
  const [error, setError] = useState(''); // מצב השגיאה

  // בדיקת הקורסים שנרכשו על ידי המשתמש הנוכחי
  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/users/me/purchases`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // לוודא שה-Token נשלח כראוי
          },
        });

        // הדפסת הנתונים שמגיעים מהשרת בקונסול
        console.log('Purchased courses and workshops fetched from server:', response.data.purchases);

        // עדכון ה-state עם הנתונים מהשרת
        setPurchases(response.data.purchases);
      } catch (error) {
        console.error('Failed to fetch purchased courses:', error);
        setError('שגיאה בטעינת הרכישות');
      }
    };

    if (userId) {
      fetchPurchasedCourses();
    }
  }, [userId]);

  return (
    <div className="purchases-wrapper">
      <h1>הרכישות שלי</h1>
      {purchases.courses?.length > 0 || purchases.workshops?.length > 0 ? (
        <ul className="purchases-list">
          {/* הצגת הקורסים שנרכשו */}
          {purchases.courses.map((course) => (
            <li key={course._id}>
              <div className="purchase-item">
                <h3>{course.name}</h3>
                <p>תיאור: {course.description}</p>
                <p>מחיר: {course.price} ש"ח</p>
              </div>
            </li>
          ))}

          {/* הצגת הסדנאות שנרכשו */}
          {purchases.workshops.map((workshop) => (
            <li key={workshop._id}>
              <div className="purchase-item">
                <h3>{workshop.name}</h3>
                <p>תיאור: {workshop.description}</p>
                <p>מחיר: {workshop.price} ש"ח</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>לא ביצעת רכישות עדיין</p>
      )}
    </div>
  );
};

export default MyPurchases;
