import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddWorkshop.css';

export default function AddWorkshop({ addWorkshop }) {
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState('');
  const [workshopDetails, setWorkshopDetails] = useState(''); 
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopCapacity, setWorkshopCapacity] = useState(''); 
  const [workshopStartDate, setWorkshopStartDate] = useState(''); 
  const [workshopStartTime, setWorkshopStartTime] = useState(''); 
  const [workshopImage, setWorkshopImage] = useState(null);
  const [error, setError] = useState(null);

  //פונקציה שמטפלת בשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();// מניעת רענון הדף בברירת מחדל
    setError(null);

    try {
      //יצירת אובייקט FormData כדי לשלוח נתונים שכוללים קבצים
      const formData = new FormData();
      formData.append('name', workshopName);
      formData.append('workshopDescription', workshopDescription); 
      formData.append('workshopDetails', workshopDetails); 
      formData.append('price', workshopPrice);
      formData.append('capacity', workshopCapacity); 
      formData.append('startDate', `${workshopStartDate}T${workshopStartTime}`);
      formData.append('startTime', workshopStartTime);

      if (workshopImage) {
        formData.append('image', workshopImage);
      }
      // שליחת בקשת POST לשרת להוספת סדנה חדשה
      const response = await axios.post(
        'http://localhost:3000/api/v1/workshops',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      addWorkshop(response.data); 
      navigate('/workshops'); 
    } catch (error) {
      console.error('הוספת הסדנה נכשלה:', error.response ? error.response.data : error.message);
      setError('הוספת הסדנה נכשלה. אנא בדוק את הטופס ונסה שוב.'); 
    }
  };

  // פונקציה לעדכון המצב כאשר קובץ תמונה נבחר
  const handleImageChange = (e) => {
    setWorkshopImage(e.target.files[0]); 
  };

  return (
    <div className="add-workshop-container">
      <h1>הוספת סדנא חדשה</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>:שם הסדנא</label>
          <input
            type="text"
            value={workshopName}
            onChange={(e) => setWorkshopName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:תיאור הסדנא</label>
          <textarea
            value={workshopDescription}
            onChange={(e) => setWorkshopDescription(e.target.value)}
            placeholder="תיאור קצר של הסדנא"
            required
          ></textarea>
        </div>
        <div>
          <label>:פרטי הסדנא</label>
          <textarea
            value={workshopDetails}
            onChange={(e) => setWorkshopDetails(e.target.value)}
            placeholder="פרטים מלאים על הסדנא"
            required
          ></textarea>
        </div>
        <div>
          <label>:מחיר הסדנא</label>
          <input
            type="number"
            value={workshopPrice}
            onChange={(e) => setWorkshopPrice(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:קיבולת משתתפים בסדנא</label>
          <input
            type="number"
            value={workshopCapacity}
            onChange={(e) => setWorkshopCapacity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:תאריך תחילת הסדנא</label>
          <input
            type="date"
            value={workshopStartDate}
            onChange={(e) => setWorkshopStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:שעת תחילת הסדנא</label>
          <input
            type="time"
            value={workshopStartTime}
            onChange={(e) => setWorkshopStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:תמונה לסדנא</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <button type="submit">הוסף סדנא</button>
      </form>
      {error && <p className="error-message">{error}</p>} 
    </div>
  );
}
