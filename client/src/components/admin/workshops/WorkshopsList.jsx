import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './workshopsList.css';

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); // מצב לסינון כללי (כמו תפוסה מלאה או פנויה)
  const [showTable, setShowTable] = useState(false); // מצב להצגת הטבלה
  const [searchTerm, setSearchTerm] = useState(''); // מצב לחיפוש לפי שם סדנה
  const navigate = useNavigate(); // הגדרת navigate

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/workshops');
        setWorkshops(response.data);
      } catch (err) {
        setError('שגיאה בטעינת הסדנאות');
      }
    };

    fetchWorkshops();
  }, []);

  // פונקציה למחיקת סדנה
  const handleDeleteWorkshop = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/workshops/${id}`);
      setWorkshops(workshops.filter(workshop => workshop._id !== id)); // עדכון הסטייט לאחר המחיקה
    } catch (err) {
      setError('שגיאה במחיקת הסדנה');
    }
  };

  // פונקציה לעריכת סדנה
  const handleEditWorkshop = (id) => {
    navigate(`/edit-workshop/${id}`); // ניווט לדף עריכת הסדנה
  };

  // פונקציה לחישוב הכנסות
  const calculateRevenue = (workshop) => {
    return workshop.participants * workshop.price;
  };

  // פונקציה לחישוב כמות המקומות הפנויים בסדנה
  const calculateAvailableSpots = (workshop) => {
    return workshop.capacity - workshop.participants;
  };

  // סינון הסדנאות לפי מצב תפוסה
  const filteredWorkshops = workshops.filter(workshop => {
    if (filter === 'available') {
      return workshop.participants < workshop.capacity; // סדנאות עם מקומות פנויים
    } else if (filter === 'full') {
      return workshop.participants >= workshop.capacity; // סדנאות מלאות
    } else {
      return true; // הצגת כל הסדנאות
    }
  });

  // סינון לפי חיפוש שם סדנה, כך שהשם יתחיל בערך החיפוש בלבד
const searchedWorkshops = filteredWorkshops.filter(workshop =>
  workshop.name.toLowerCase().startsWith(searchTerm.toLowerCase())
);


  // מיון הסדנאות לפי הכנסות (מהגבוה לנמוך)
  const sortedWorkshops = searchedWorkshops.sort((a, b) => calculateRevenue(b) - calculateRevenue(a));

  // פונקציה להצגת הטבלה לאחר לחיצה על כפתור
  const handleShowTable = (filterType) => {
    setFilter(filterType); // עדכון הסינון
    setShowTable(true); // הצגת הטבלה
  };

  return (
    <div className="workshops-wrapper">
      <div className="workshops-list">
        <h1>רשימת סדנאות</h1>
        {error && <p className="error-message">{error}</p>}
        
        {/* כפתורים לסינון הסדנאות */}
        <div className="filter-buttons">
          <button onClick={() => handleShowTable('all')}>הצג את כל הסדנאות</button>
          <button onClick={() => handleShowTable('available')}>סדנאות עם מקומות פנויים</button>
          <button onClick={() => handleShowTable('full')}>סדנאות בתפוסה מלאה</button>
        </div>

        {/* אינפוט לחיפוש סדנה */}
        {showTable && (
          <input
            type="text"
            placeholder="חפש סדנה לפי שם"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}

        {/* הצגת הטבלה רק לאחר לחיצה על כפתור */}
        {showTable && (
          <table>
            <thead>
              <tr>
                <th>פעולות</th>
                <th>סטטוס</th>
                <th>הכנסות</th>
                <th>משתתפים</th>
                <th>תאריך יצירה</th>
                <th>תיאור בקצרה</th>
                <th>מחיר</th>
                <th>שם סדנה</th>
              </tr>
            </thead>
            <tbody>
              {sortedWorkshops.map((workshop) => (
                <tr key={workshop._id}>
                  <td>
                    <button className="edit" onClick={() => handleEditWorkshop(workshop._id)}>ערוך</button> {/* שימוש בפונקציית עריכה */}
                    <button className="delete" onClick={() => handleDeleteWorkshop(workshop._id)}>מחק</button> {/* שימוש בפונקציית מחיקה */}
                  </td>
                  <td>
                    {/* בדיקה אם הסדנה מלאה והצגת הכיתוב */}
                    {workshop.participants >= workshop.capacity ? (
                      <span className="full-workshop">הסדנה מלאה</span>
                    ) : (
                      <span className="available-workshop">נשארו {calculateAvailableSpots(workshop)} מקומות</span>
                    )}
                  </td>
                  <td className='price-cell-workshopList'>{calculateRevenue(workshop)} ש"ח</td> {/* הצגת ההכנסות */}
                  <td>{workshop.participants} / {workshop.capacity}</td>
                  <td>{new Date(workshop.createdAt).toLocaleDateString()}</td>
                  <td>{workshop.workshopDescription}</td>
                  <td className='price-cell-workshopList'>{workshop.price} ש"ח</td>
                  <td>{workshop.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkshopsList;
