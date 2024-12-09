import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPurchases.css';

const MyPurchases = () => {
  const [purchases, setPurchases] = useState([]);
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

        console.log('נתוני תגובה:', response.data.purchases);


        const allPurchases = [
          ...response.data.purchases.courses.map((course) => ({ ...course, type: 'קורס' })),
          ...response.data.purchases.workshops.map((workshop) => ({ ...workshop, type: 'סדנה' }))
        ].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

        setPurchases(allPurchases);
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

        {purchases.length > 0 ? (
          <table className="purchases-table">
            <thead>
              <tr>
                <th>תאריך רכישה</th>
                <th>מחיר</th>
                <th>סוג פריט</th>
                <th>שם פריט</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase._id}>
                  <td>
                    {purchase.purchaseDate 
                      ? new Date(purchase.purchaseDate).toLocaleString() 
                      : 'תאריך לא זמין'}
                  </td>
                  <td className="price-cell-myPurchases">{purchase.price} ש"ח</td>
                  <td>{purchase.type}</td>
                  <td>{purchase.name}</td>
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
