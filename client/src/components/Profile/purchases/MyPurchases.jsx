// MyPurchases.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './MyPurchases.css'; // אל תשכח לשים כאן את קובץ ה-CSS הנכון אם הוא קיים

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]); // מצב הרכישות
  const [error, setError] = useState(''); // מצב השגיאה

  // משיכת הרכישות של המשתמש בעת טעינת הקומפוננטה
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/users/me/purchases', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // אם המידע התקבל, עדכן את מצב הרכישות
        if (response.data.data) {
          const { purchasedCourses, purchasedWorkshops } = response.data.data;
          const allPurchases = [...(purchasedCourses || []), ...(purchasedWorkshops || [])];
          setPurchases(allPurchases);
        } else {
          setError('לא נמצאו רכישות');
        }
      } catch (err) {
        console.error('Error fetching purchases:', err); // הוסף לוג למעקב אחר השגיאה
        setError('נכשלה שליפת הרכישות');
      }
    };

    fetchPurchases();
  }, []);

  if (error) {
    return (
      <div className="purchases-wrapper">
        <div className="error-message">{error}</div>
      </div>
    );
  }

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
