import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./workshops.css"; 

export default function Workshops({ isAdmin }) {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    const fetchWorkshops = async () => {
      try {

        const response = await axios.get(
          "http://localhost:3000/api/v1/workshops"
        );


        setWorkshops(response.data);
      } catch (error) {
        console.error("Failed to fetch workshops:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchWorkshops();
  }, [isAdmin]);


  const handleDelete = async (workshopId) => {
    try {

      await axios.delete(
        `http://localhost:3000/api/v1/workshops/${workshopId}`
      );
      setWorkshops(workshops.filter((workshop) => workshop._id !== workshopId));
    } catch (error) {
      console.error("מחיקת הסדנה נכשלה:", error);
    }
  };


  const handleEdit = (workshopId) => {
    window.location.href = `/edit-workshop/${workshopId}`;
  };


  const handleDetails = (workshopId) => {
    window.location.href = `/workshop-details/${workshopId}`;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  if (loading) {
    return <div>טוען סדנאות...</div>;
  }

  return (
    <div>

      {isAdmin && (
        <div className="add-workshop-button-container">
          <Link to="/add-workshop" className="add-workshop-button">
            הוסף סדנא חדשה
          </Link>
        </div>
      )}

      <div className="workshops-container">
        {workshops.length > 0 ? (
          workshops.map((workshop) => {
            const startDate = new Date(workshop.startDate);
            startDate.setHours(0, 0, 0, 0); 
            const isFull = workshop.participants >= workshop.capacity; 
            const hasWorkshopStarted = startDate <= today;

            return (
              <div key={workshop._id} className="workshop-card">
                <h3>{workshop.name}</h3>
                {workshop.image && (
                  <img
                    src={`http://localhost:3000/${workshop.image}`}
                    alt={workshop.name}
                  />
                )}
                <p>{workshop.workshopDescription}</p>{" "}
                
                <p className="price">מחיר: {workshop.price} ש"ח</p>
                {isFull && hasWorkshopStarted ? (
                  <div>
                    <span className="full-label">סדנה זאת מלאה</span>
                    <span className="started-label">סדנה זאת התחילה</span>
                  </div>
                ) : isFull ? (
                  <span className="full-label">סדנה זאת מלאה</span>
                ) : hasWorkshopStarted ? (
                  <span className="started-label">סדנה זאת התחילה</span>
                ) : null}
                
                <button
                  onClick={() => handleDetails(workshop._id)}
                  className="details-button"
                >
                  פרטים נוספים
                </button>
                
                {isAdmin && (
                  <div>
                    <p className="participants">
                      משתתפים בסדנה: {workshop.participants} מתוך{" "}
                      {workshop.capacity}
                    </p>
                    <p className="creation-date">
                      נפתחה בתאריך:{" "}
                      {new Date(workshop.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                <p className="start-date">
                  מועד תחילת הסדנה:{" "}
                  {workshop.startDate
                    ? new Date(workshop.startDate).toLocaleDateString()
                    : "לא נקבע תאריך"}
                </p>
                <p className="start-time">
                  שעת תחילת הסדנה:{" "}
                  {workshop.startDate
                    ? new Date(workshop.startDate).toLocaleTimeString("he-IL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "לא נקבעה שעה"}
                </p>
                {isAdmin && (
                  <div className="workshop-actions">
                    <button
                      onClick={() => handleEdit(workshop._id)}
                      className="edit-button"
                    >
                      ערוך
                    </button>
                    <button
                      onClick={() => handleDelete(workshop._id)}
                      className="delete-button"
                    >
                      מחק
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>אין סדנאות להצגה</p>
        )}
      </div>
    </div>
  );
}
