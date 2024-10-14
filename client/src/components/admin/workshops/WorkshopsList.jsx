import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './workshopsList.css';

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(''); // מצב לסינון
  const [showTable, setShowTable] = useState(false); // מצב להצגת הטבלה
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

  // סינון הסדנאות לפי מצב
  const filteredWorkshops = workshops.filter(workshop => {
    if (filter === 'available') {
      return workshop.participants < workshop.capacity; // סדנאות עם מקומות פנויים
    } else if (filter === 'full') {
      return workshop.participants >= workshop.capacity; // סדנאות מלאות
    } else {
      return true; // הצגת כל הסדנאות
    }
  });

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

        {/* הצגת הטבלה רק לאחר לחיצה על כפתור */}
        {showTable && (
          <table>
            <thead>
              <tr>
                <th>שם סדנה</th>
                <th>מחיר</th>
                <th>תיאור בקצרה</th>
                <th>תאריך יצירה</th>
                <th>משתתפים</th>
                <th>הכנסות</th> {/* עמודה עבור ההכנסות */}
                <th>סטטוס</th> {/* עמודה עבור הסטטוס */}
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkshops.map((workshop) => (
                <tr key={workshop._id}>
                  <td>{workshop.name}</td>
                  <td>{workshop.price} ש"ח</td>
                  <td>{workshop.description}</td>
                  <td>{new Date(workshop.createdAt).toLocaleDateString()}</td>
                  <td>{workshop.participants} / {workshop.capacity}</td>
                  <td>{calculateRevenue(workshop)} ש"ח</td> {/* הצגת ההכנסות */}
                  <td>
                    {/* בדיקה אם הסדנה מלאה והצגת הכיתוב */}
                    {workshop.participants >= workshop.capacity ? (
                      <span className="full-workshop">הסדנה מלאה</span>
                    ) : (
                      <span className="available-workshop">נשארו {calculateAvailableSpots(workshop)} מקומות</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEditWorkshop(workshop._id)}>ערוך</button> {/* שימוש בפונקציית עריכה */}
                    <button className="delete" onClick={() => handleDeleteWorkshop(workshop._id)}>מחק</button> {/* שימוש בפונקציית מחיקה */}
                  </td>
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
