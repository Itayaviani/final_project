import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddWorkshop.css'; // ייבוא קובץ ה-CSS

export default function AddWorkshop({ addWorkshop }) {
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState('');
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopCapacity, setWorkshopCapacity] = useState(''); // הוספת שדה לקיבולת הסדנה
  const [workshopStartDate, setWorkshopStartDate] = useState(''); // שדה חדש לתאריך תחילת הסדנה
  const [workshopImage, setWorkshopImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(workshopName, workshopDescription, workshopPrice, workshopCapacity, workshopStartDate, workshopImage);
    
    try {
      // יצירת אובייקט FormData כדי לשלוח את הנתונים כולל התמונה
      const formData = new FormData();
      formData.append('name', workshopName);
      formData.append('description', workshopDescription);
      formData.append('price', workshopPrice);
      formData.append('capacity', workshopCapacity);
      formData.append('startDate', workshopStartDate); // הוספת תאריך התחלת הסדנה ל-FormData
      formData.append('image', workshopImage);

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
      console.error('Failed to add workshop:', error);
    }
  };

  const handleImageChange = (e) => {
    setWorkshopImage(e.target.files[0]);
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
          <label>פרטי הסדנא:</label>
          <textarea
            value={workshopDescription}
            onChange={(e) => setWorkshopDescription(e.target.value)}
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
          <label>תאריך תחילת הסדנא:</label> {/* שדה חדש לתאריך התחלה */}
          <input
            type="date"
            value={workshopStartDate}
            onChange={(e) => setWorkshopStartDate(e.target.value)}
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
    </div>
  );
}
