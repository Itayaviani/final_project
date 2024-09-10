import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WorkshopDetail.css';


export default function WorkshopDetail() {
  const { workshopId } = useParams(); // שימוש ב-useParams לקבלת ה-workshopId מהנתיב
  const [workshop, setWorkshop] = useState(null);
  const navigate = useNavigate(); // שימוש ב-useNavigate לניווט בין דפים

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/workshops/${workshopId}`);
        setWorkshop(response.data);
      } catch (error) {
        console.error('Failed to fetch workshop details:', error);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  // פונקציה לניתוב לעמוד התשלום
  const handlePurchase = () => {
    navigate(`/payment/${workshopId}`); // ניתוב לעמוד CoursePayment עם מזהה הסדנא
  };

  if (!workshop) {
    return <p>טוען פרטים...</p>;
  }

  return (
    <div className="workshop-details-container">
      <h1>שם הסדנא: {workshop.name}</h1>
      {workshop.image && <img src={workshop.image} alt={workshop.name} />}
      <p>{workshop.description}</p>
      <p>מחיר: {workshop.price} ש"ח</p>
      
      {/* הוספת כפתור לרכישה */}
      <button onClick={handlePurchase} className="purchase-button">רכוש סדנא</button>
    </div>
  );
}