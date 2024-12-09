import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './WorkshopDetail.css';

export default function WorkshopDetail() {
  const { workshopId } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const navigate = useNavigate();

  // שימוש ב-useEffect לביצוע בקשת HTTP להבאת פרטי הסדנה בעת טעינת הרכיב
  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        // בקשה לשרת לקבלת פרטי הסדנה לפי מזהה
        const response = await axios.get(`http://localhost:3000/api/v1/workshops/${workshopId}`);
        setWorkshop(response.data);
      } catch (error) {
        console.error('Failed to fetch workshop details:', error);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  // פונקציה לניווט לעמוד תשלום עבור הסדנה
  const handlePurchase = () => {
    navigate(`/payment/workshops/${workshopId}`);
  };

  // פונקציה לחלוקה לפסקאות של 200 מילים עם סינון פסקאות ריקות
  const splitTextIntoParagraphs = (text) => {
    const words = text.split(' ');
    const paragraphs = [];
    for (let i = 0; i < words.length; i += 200) {
      const paragraph = words.slice(i, i + 200).join(' ').trim();
      if (paragraph) { // רק אם הפסקה לא ריקה, נוסיף אותה לרשימה
        paragraphs.push(paragraph);
      }
    }
    return paragraphs;
  };

  if (!workshop) {
    return <p>טוען פרטים...</p>;
  }

  // חלוקת תיאור הסדנה ופרטי הסדנה לפסקאות
  const descriptionParagraphs = splitTextIntoParagraphs(workshop.description || '');
  const detailsParagraphs = splitTextIntoParagraphs(workshop.workshopDetails || '');

  return (
    <div className="workshop-details-container">
      <h1>שם הסדנא: {workshop.name}</h1>
      {workshop.image && (
        <img src={`http://localhost:3000/${workshop.image}`} alt={workshop.name} className="workshop-image" />
      )}
      
      
      <div className="workshop-text-section">
        {descriptionParagraphs.map((paragraph, index) => (
          <div key={`desc-${index}`} className="workshop-text-box">
            <p>{paragraph}</p>
          </div>
        ))}
      </div>

      
      <div className="workshop-text-section">
        {detailsParagraphs.map((paragraph, index) => (
          <div key={`details-${index}`} className="workshop-text-box">
            <p>{paragraph}</p>
          </div>
        ))}
      </div>

      <p>מחיר: {workshop.price} ש"ח</p>
      
      <button onClick={handlePurchase} className="purchase-button">רכוש סדנא</button>
    </div>
  );
}
