import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './purchasesAdmin.css';

const PurchasesAdmin = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const [filteredType, setFilteredType] = useState(null); // שינוי ברירת המחדל ל-null כדי להסתיר את הטבלה בהתחלה

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/purchases/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setPurchases(response.data.data.purchases); // עדכון המצב עם רשימת הרכישות
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError('שגיאה בטעינת הרכישות');
      }
    };

    fetchPurchases();
  }, []);

  // פונקציה להצגת כל הקורסים בלבד
  const showCourses = () => {
    setFilteredType('courses');
  };

  // פונקציה להצגת כל הסדנאות בלבד
  const showWorkshops = () => {
    setFilteredType('workshops');
  };

  return (
    <div className="purchases-list">
      <h1>היסטוריית רכישות</h1>
      {error && <p className="error-message">{error}</p>}

      {/* הוספת כפתורים להצגת קורסים וסדנאות */}
      <div className="filter-buttons">
        <button onClick={showCourses}>הצג קורסים</button>
        <button onClick={showWorkshops}>הצג סדנאות</button>
      </div>

      {/* הצגת הטבלה רק לאחר לחיצה על אחד הכפתורים */}
      {filteredType && (
        <table className="purchases-table">
          <thead>
            <tr>
              <th>שם משתמש</th>
              <th>סוג פריט</th>
              <th>שם פריט</th>
              <th>מחיר</th>
              <th>תאריך רכישה</th>
              
            </tr>
          </thead>
          <tbody>
            {purchases.map((userPurchase) => (
              <>
                {/* הצגת קורסים בהתאם לבחירה */}
                {filteredType === 'courses' &&
                  userPurchase.courses.map((course) => (
                    <tr key={course._id}>
                      <td>{userPurchase.name}</td>
                      <td>קורס</td>
                      <td>{course.name}</td>
                      <td>{course.price} ש"ח</td>
                      <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                      
                    </tr>
                  ))}
                
                {/* הצגת סדנאות בהתאם לבחירה */}
                {filteredType === 'workshops' &&
                  userPurchase.workshops.map((workshop) => (
                    <tr key={workshop._id}>
                      <td>{userPurchase.name}</td>
                      <td>סדנה</td>
                      <td>{workshop.name}</td>
                      <td>{workshop.price} ש"ח</td>
                      <td>{new Date(workshop.createdAt).toLocaleDateString()}</td>
                      
                    </tr>
                  ))}
              </>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchasesAdmin;
