import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './purchasesAdmin.css';

const PurchasesAdmin = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const [filteredType, setFilteredType] = useState(null); // שינוי ברירת המחדל ל-null כדי להסתיר את הטבלה בהתחלה
  const [searchTerm, setSearchTerm] = useState(''); // מצב לחיפוש לפי שם משתמש

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

  // סינון לפי שם משתמש
  const filteredPurchases = purchases.filter(userPurchase =>
    userPurchase.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

  return (
    <div className="purchases-admin-page">
      <div className="purchases-wrapper">
        <div className="purchases-list">
          <h1>היסטוריית רכישות</h1>
          {error && <p className="error-message">{error}</p>}

          {/* כפתורים להצגת קורסים וסדנאות */}
          <div className="filter-buttons">
            <button onClick={showCourses}>הצג קורסים</button>
            <button onClick={showWorkshops}>הצג סדנאות</button>
          </div>

          {/* תיבת חיפוש לפי שם משתמש */}
          {filteredType && (
            <input
              type="text"
              placeholder="חפש לפי שם משתמש"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          )}

          {/* הצגת הטבלה רק לאחר לחיצה על אחד הכפתורים */}
          {filteredType && (
            <table className="purchases-table">
              <thead>
                <tr>
                  <th>תאריך רכישה</th>
                  <th>מחיר</th>
                  <th>שם פריט</th>
                  <th>סוג פריט</th>
                  <th>שם משתמש</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases
                  .map((userPurchase) => ({
                    ...userPurchase,
                    courses: userPurchase.courses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                    workshops: userPurchase.workshops.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
                  }))
                  .map((userPurchase) => (
                    <React.Fragment key={userPurchase._id}>
                      {/* הצגת קורסים בהתאם לבחירה */}
                      {filteredType === 'courses' &&
                        userPurchase.courses.map((course) => (
                          <tr key={course._id}>
                            <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                            <td className="price-cell-purchasesAdmin">{course.price} ש"ח</td>
                            <td>{course.name}</td>
                            <td>קורס</td>
                            <td>{userPurchase.name}</td>
                          </tr>
                        ))}

                      {/* הצגת סדנאות בהתאם לבחירה */}
                      {filteredType === 'workshops' &&
                        userPurchase.workshops.map((workshop) => (
                          <tr key={workshop._id}>
                            <td>{new Date(workshop.createdAt).toLocaleDateString()}</td>
                            <td className="price-cell-purchasesAdmin">{workshop.price} ש"ח</td>
                            <td>{workshop.name}</td>
                            <td>סדנה</td>
                            <td>{userPurchase.name}</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesAdmin;
