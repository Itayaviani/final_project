import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditWorkshops.css';

export default function EditWorkshop() {
  const { workshopId } = useParams();
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState(''); 
  const [workshopDetails, setWorkshopDetails] = useState('');
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopCapacity, setWorkshopCapacity] = useState('');
  const [workshopStartDate, setWorkshopStartDate] = useState(''); 
  const [workshopStartTime, setWorkshopStartTime] = useState(''); 
  const [workshopImage, setWorkshopImage] = useState(null); 
  const [currentImage, setCurrentImage] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    //פונקציה לטעינת הסדנאות
    const fetchWorkshop = async () => {
      try {
        //בקשה לשרת לקבלת פרטי הסדנה עם המזהה המסויים
        const response = await axios.get(`http://localhost:3000/api/v1/workshops/${workshopId}`);
        const { name, workshopDescription, workshopDetails, price, capacity, image, startDate, startTime } = response.data; // קבלת הערכים מהשרת
        setWorkshopName(name);
        setWorkshopDescription(workshopDescription); 
        setWorkshopDetails(workshopDetails); 
        setWorkshopPrice(price);
        setWorkshopCapacity(capacity);
        setWorkshopStartDate(startDate ? new Date(startDate).toISOString().split('T')[0] : ''); 
        setWorkshopStartTime(startTime); 

        setCurrentImage(image); 
      } catch (error) {
        console.error('לא הצליח להביא את הסדנה:', error);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  // פונקציה לטיפול בשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();

    // הכנת הנתונים לשליחה
    const formData = new FormData();
    formData.append('name', workshopName);
    formData.append('workshopDescription', workshopDescription);
    formData.append('workshopDetails', workshopDetails); 
    formData.append('price', workshopPrice);
    formData.append('capacity', workshopCapacity);
    formData.append('startDate', `${workshopStartDate}T${workshopStartTime}`); 
    formData.append('startTime', workshopStartTime);

    // עדכון התמונה רק אם הועלה תמונה חדשה
    if (workshopImage) {
      formData.append('image', workshopImage);
    }

    try {
      // שליחת הנתונים לשרת
      await axios.put(`http://localhost:3000/api/v1/workshops/${workshopId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      
      navigate('/workshops'); 
    } catch (error) {
      console.error('עריכת הסדנה נכשלה:', error);
    }
  };

  // פונקציה לטיפול בשינוי התמונה
  const handleImageChange = (e) => {
    setWorkshopImage(e.target.files[0]);
  };

  return (
    <div className="edit-workshop-wrapper">
      <div className="edit-workshop-container">
        <h1>עריכת סדנה</h1>
        <form onSubmit={handleSubmit} className="edit-workshop-form">
          <div className="form-group">
            <label>:שם הסדנה</label>
            <input
              type="text"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>:תיאור הסדנה</label>
            <textarea
              value={workshopDescription}
              onChange={(e) => setWorkshopDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>:פרטי הסדנה</label>
            <textarea
              value={workshopDetails}
              onChange={(e) => setWorkshopDetails(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>:מחיר הסדנה</label>
            <input
              type="number"
              value={workshopPrice}
              onChange={(e) => setWorkshopPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>:קיבולת משתתפים</label>
            <input
              type="number"
              value={workshopCapacity}
              onChange={(e) => setWorkshopCapacity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>:מועד תחילת הסדנה</label>
            <input
              type="date"
              value={workshopStartDate}
              onChange={(e) => setWorkshopStartDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>:שעת תחילת הסדנה</label>
            <input
              type="time"
              value={workshopStartTime}
              onChange={(e) => setWorkshopStartTime(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>:תמונה נוכחית</label>
            {currentImage && (
              <div className="current-image">
                <img src={`http://localhost:3000/${currentImage}`} alt="Current Workshop" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label>:עדכן תמונה חדשה</label>
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
