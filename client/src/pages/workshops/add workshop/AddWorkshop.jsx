import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddWorkshop.css'; // ייבוא קובץ ה-CSS

export default function AddWorkshop({ addWorkshop }) {
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState(''); // תיאור קצר של הסדנה
  const [workshopDetails, setWorkshopDetails] = useState(''); // פרטים מלאים של הסדנה
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopCapacity, setWorkshopCapacity] = useState(''); // הוספת שדה לקיבולת הסדנה
  const [workshopStartDate, setWorkshopStartDate] = useState(''); // שדה לתאריך תחילת הסדנה
  const [workshopStartTime, setWorkshopStartTime] = useState(''); // שדה לשעת תחילת הסדנה
  const [workshopImage, setWorkshopImage] = useState(null);
  const [error, setError] = useState(null); // לניהול שגיאות
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // איפוס שגיאות קודמות

    try {
      // יצירת FormData והוספת כל השדות הרלוונטיים
      const formData = new FormData();
      formData.append('name', workshopName);
      formData.append('workshopDescription', workshopDescription); // הוספת תיאור קצר של הסדנה
      formData.append('workshopDetails', workshopDetails); // הוספת פרטים מלאים של הסדנה
      formData.append('price', workshopPrice);
      formData.append('capacity', workshopCapacity); // הוספת קיבולת
      formData.append('startDate', `${workshopStartDate}T${workshopStartTime}`); // הוספת תאריך ושעת התחלת הסדנה ל-FormData
      formData.append('startTime', workshopStartTime); // הוספת שעת התחלה כמשתנה נפרד

      if (workshopImage) {
        formData.append('image', workshopImage); // הוספת התמונה אם קיימת
      }

      const response = await axios.post(
        'http://localhost:3000/api/v1/workshops',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      addWorkshop(response.data); // עדכון המצב עם הסדנה החדשה
      navigate('/workshops'); // ניווט לרשימת הסדנאות לאחר ההוספה
    } catch (error) {
      console.error('Failed to add workshop:', error.response ? error.response.data : error.message);
      setError('Failed to add workshop. Please check the form and try again.'); // הצגת הודעת שגיאה
    }
  };

  const handleImageChange = (e) => {
    setWorkshopImage(e.target.files[0]); // טיפול בשינוי התמונה
  };

  return (
    <div className="add-workshop-container">
      <h1>הוספת סדנא חדשה</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם הסדנא:</label>
          <input
            type="text"
            value={workshopName}
            onChange={(e) => setWorkshopName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תיאור הסדנא:</label>
          <textarea
            value={workshopDescription}
            onChange={(e) => setWorkshopDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>פרטי הסדנא:</label>
          <textarea
            value={workshopDetails}
            onChange={(e) => setWorkshopDetails(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>מחיר הסדנא:</label>
          <input
            type="number"
            value={workshopPrice}
            onChange={(e) => setWorkshopPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>קיבולת משתתפים בסדנא:</label>
          <input
            type="number"
            value={workshopCapacity}
            onChange={(e) => setWorkshopCapacity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תאריך תחילת הסדנא:</label>
          <input
            type="date"
            value={workshopStartDate}
            onChange={(e) => setWorkshopStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>שעת תחילת הסדנא:</label>
          <input
            type="time"
            value={workshopStartTime}
            onChange={(e) => setWorkshopStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תמונה לסדנא:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">הוסף סדנא</button>
      </form>
      {error && <p className="error-message">{error}</p>} {/* הצגת שגיאה אם קיימת */}
    </div>
  );
}
