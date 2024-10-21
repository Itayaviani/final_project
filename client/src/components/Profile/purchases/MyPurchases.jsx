import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPurchases.css';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState({ courses: [], workshops: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/v1/users/me/purchases',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        console.log('Purchased courses and workshops:', response.data.purchases);
        setPurchases(response.data.purchases);
      } catch (error) {
        console.error('Failed to fetch purchased courses:', error);
        setError('שגיאה בטעינת הרכישות');
      }
    };

    fetchPurchasedCourses();
  }, []);

  return (
    <div className="purchases-wrapper">
      <div className="purchases-container">
        <h1>:הרכישות שלי</h1>
        {error && <p className="error-message">{error}</p>}

        {purchases.courses.length > 0 || purchases.workshops.length > 0 ? (
          <table className="purchases-table">
            <thead>
              <tr>
                <th>תאריך רכישה</th> {/* הכותרת הראשונה */}
                <th>מחיר</th> {/* הכותרת השנייה */}
                <th>סוג פריט</th> {/* הכותרת השלישית */}
                <th>שם פריט</th> {/* הכותרת הרביעית */}
              </tr>
            </thead>
            <tbody>
              {/* הצגת קורסים */}
              {purchases.courses.map((course) => (
                <tr key={course._id}>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td> {/* תאריך רכישה */}
                  <td>{course.price} ש"ח</td> {/* מחיר */}
                  <td>קורס</td> {/* סוג פריט */}
                  <td>{course.name}</td> {/* שם פריט */}
                </tr>
              ))}
              {/* הצגת סדנאות */}
              {purchases.workshops.map((workshop) => (
                <tr key={workshop._id}>
                  <td>{new Date(workshop.createdAt).toLocaleDateString()}</td> {/* תאריך רכישה */}
                  <td>{workshop.price} ש"ח</td> {/* מחיר */}
                  <td>סדנה</td> {/* סוג פריט */}
                  <td>{workshop.name}</td> {/* שם פריט */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>לא ביצעת רכישות עדיין</p>
        )}
      </div>
    </div>
  );
};

export default MyPurchases;
