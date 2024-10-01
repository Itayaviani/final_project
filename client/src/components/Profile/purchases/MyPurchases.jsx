// MyPurchases.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './myPurchases.css'; // אל תשכח לשים כאן את קובץ ה-CSS הנכון אם הוא קיים

const MyPurchases = ({userId}) => {
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
      console.log('Purchased courses fetched from server:', response.data.purchases); // בדיקת הנתונים מהשרת
      setPurchases(response.data.purchases);
    } catch (error) {
      console.error('Failed to fetch purchased courses:', error);
    }
  };

  if (userId) {
    fetchPurchasedCourses();
  }
}, [userId]);


  return (
    <div className="purchases-wrapper">
      <h1>הרכישות שלי</h1>
      {purchases.length > 0 ? (
        <ul className="purchases-list">
          {purchases.map((purchase) => (
            <li key={purchase._id}>
              <div className="purchase-item">
                <h3>{purchase.name}</h3>
                <p>תיאור: {purchase.description}</p>
                <p>מחיר: {purchase.price} ש"ח</p>
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
