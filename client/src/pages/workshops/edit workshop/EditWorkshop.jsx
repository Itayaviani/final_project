import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditWorkshops.css'; // ייבוא קובץ ה-CSS

export default function EditWorkshop() {
  const { workshopId } = useParams();
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState(''); // תיאור קצר של הסדנה
  const [workshopDetails, setWorkshopDetails] = useState(''); // פרטים מלאים של הסדנה
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopCapacity, setWorkshopCapacity] = useState(''); // קיבולת משתתפים
  const [workshopStartDate, setWorkshopStartDate] = useState(''); // תאריך תחילת הסדנה
  const [workshopStartTime, setWorkshopStartTime] = useState(''); // שעת תחילת הסדנה
  const [workshopImage, setWorkshopImage] = useState(null); // שדה עבור העלאת קובץ תמונה
  const [currentImage, setCurrentImage] = useState(''); // שמירה של התמונה הנוכחית
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/workshops/${workshopId}`);
        const { name, workshopDescription, workshopDetails, price, capacity, image, startDate, startTime } = response.data; // קבלת הערכים מהשרת
        setWorkshopName(name);
        setWorkshopDescription(workshopDescription); // הגדרת התיאור הקצר
        setWorkshopDetails(workshopDetails); // הגדרת פרטי הסדנה המלאים
        setWorkshopPrice(price);
        setWorkshopCapacity(capacity); // הגדרת הקיבולת
        setWorkshopStartDate(startDate ? new Date(startDate).toISOString().split('T')[0] : ''); // הגדרת תאריך התחלה לפורמט הנכון
        setWorkshopStartTime(startTime); // הגדרת שעת ההתחלה

        setCurrentImage(image); // הגדרת התמונה הנוכחית
      } catch (error) {
        console.error('Failed to fetch workshop:', error);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // הכנת הנתונים לשליחה
    const formData = new FormData();
    formData.append('name', workshopName);
    formData.append('workshopDescription', workshopDescription); // תיאור קצר של הסדנה
    formData.append('workshopDetails', workshopDetails); // פרטי הסדנה המלאים
    formData.append('price', workshopPrice);
    formData.append('capacity', workshopCapacity);
    formData.append('startDate', `${workshopStartDate}T${workshopStartTime}`); // שליחת תאריך והשעה
    formData.append('startTime', workshopStartTime); // הוספת שעת התחלה

    // עדכון התמונה רק אם הועלה תמונה חדשה
    if (workshopImage) {
      formData.append('image', workshopImage);
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/workshops/${workshopId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // בקשה עם תמונות
        },
      });
      
      navigate('/workshops'); // ניתוב חזרה לדף הסדנאות לאחר השמירה
    } catch (error) {
      console.error('Failed to edit workshop:', error);
    }
  };

  const handleImageChange = (e) => {
    setWorkshopImage(e.target.files[0]); // עדכון התמונה החדשה
  };

  return (
    <div className="edit-workshop-wrapper">
      <div className="edit-workshop-container">
        <h1>עריכת סדנה</h1>
        <form onSubmit={handleSubmit} className="edit-workshop-form">
          <div className="form-group">
            <label>שם הסדנה:</label>
            <input
              type="text"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>תיאור הסדנה:</label>
            <textarea
              value={workshopDescription}
              onChange={(e) => setWorkshopDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>פרטי הסדנה:</label>
            <textarea
              value={workshopDetails}
              onChange={(e) => setWorkshopDetails(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>מחיר הסדנה:</label>
            <input
              type="number"
              value={workshopPrice}
              onChange={(e) => setWorkshopPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>קיבולת משתתפים:</label>
            <input
              type="number"
              value={workshopCapacity}
              onChange={(e) => setWorkshopCapacity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>מועד תחילת הסדנה:</label>
            <input
              type="date"
              value={workshopStartDate}
              onChange={(e) => setWorkshopStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>שעת תחילת הסדנה:</label>
            <input
              type="time"
              value={workshopStartTime}
              onChange={(e) => setWorkshopStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>תמונה נוכחית:</label>
            {currentImage && (
              <div className="current-image">
                <img src={`http://localhost:3000/${currentImage}`} alt="Current Workshop" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>עדכן תמונה חדשה:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-button">שמור שינויים</button>
        </form>
      </div>
    </div>
  );
}
