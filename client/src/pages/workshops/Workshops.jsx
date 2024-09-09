import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './workshops.css' // ייבוא קובץ ה-CSS

export default function Workshops({ isAdmin }) {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/workshops');
        setWorkshops(response.data);
      } catch (error) {
        console.error('Failed to fetch workshops:', error);
      }
    };

    fetchWorkshops();
  }, []);

  const handleDelete = async (workshopId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/workshops/${workshopId}`);
      setWorkshops(workshops.filter(workshop => workshop._id !== workshopId));
    } catch (error) {
      console.error('Failed to delete workshop:', error);
    }
  };

  const handleEdit = (workshopId) => {
    window.location.href = `/edit-workshop/${workshopId}`;
  };

  const handleDetails = (workshopId) => {
    window.location.href = `/workshop-details/${workshopId}`;
  };

  return (
    <div>
      <h1>סדנאות</h1>

      {/* הצגת כפתור הוספת הסדנא רק אם המשתמש הוא אדמין */}
      {isAdmin && (
        <div className="add-workshop-button-container">
          <Link to="/add-workshop" className="add-workshop-button">
            הוסף סדנא חדשה
          </Link>
        </div>
      )}

      <div className="workshops-container">
        {workshops.length > 0 ? (
          workshops.map((workshop) => (
            <div key={workshop._id} className="workshop-card">
              <h3>{workshop.name}</h3>
              {workshop.image && (
                <img src={workshop.image} alt={workshop.name} />
              )}
              <p>{workshop.description}</p>
              <p className="price">מחיר: {workshop.price} ש"ח</p>
              <button onClick={() => handleDetails(workshop._id)} className="details-button">פרטים נוספים</button>
              {/* הצגת כפתורי עריכה ומחיקה רק אם המשתמש הוא אדמין */}
              {isAdmin && (
                <div className="workshop-actions">
                  <button onClick={() => handleEdit(workshop._id)} className="edit-button">ערוך</button>
                  <button onClick={() => handleDelete(workshop._id)} className="delete-button">מחק</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>אין סדנאות להצגה</p>
        )}
      </div>
    </div>
  );
}
