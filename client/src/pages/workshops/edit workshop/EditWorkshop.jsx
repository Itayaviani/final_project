import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditWorkshops.css'; // ייבוא קובץ ה-CSS

export default function EditWorkshop() {
  const { workshopId } = useParams();
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState('');
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopImage, setWorkshopImage] = useState('');
  const [workshopCapacity, setWorkshopCapacity] = useState(''); // הוספת קיבולת
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/workshops/${workshopId}`);
        const { name, description, price, image, capacity } = response.data;
        setWorkshopName(name);
        setWorkshopDescription(description);
        setWorkshopPrice(price);
        setWorkshopImage(image);
        setWorkshopCapacity(capacity); // קביעת ערך הקיבולת
      } catch (error) {
        console.error('Failed to fetch workshop:', error);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', workshopName);
    formData.append('description', workshopDescription);
    formData.append('price', workshopPrice);
    formData.append('capacity', workshopCapacity);
    if (workshopImage) {
      formData.append('image', workshopImage);
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/workshops/${workshopId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/workshops');
    } catch (error) {
      console.error('Failed to edit workshop:', error);
    }
  };

  const handleImageChange = (e) => {
    setWorkshopImage(e.target.files[0]);
  };

  return (
    <div className="edit-workshop-wrapper">
      <div className="edit-workshop-container">
        <h1>עריכת סדנא</h1>
        <form onSubmit={handleSubmit} className="edit-workshop-form">
          <div className="form-group">
            <label>שם הסדנא:</label>
            <input
              type="text"
              value={workshopName}
              onChange={(e) => setWorkshopName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>פרטי הסדנא:</label>
            <textarea
              value={workshopDescription}
              onChange={(e) => setWorkshopDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>מחיר הסדנא:</label>
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
          
          {/* הצגת התמונה הנוכחית מעל שדה העלאת התמונה החדשה */}
          {workshopImage && typeof workshopImage === 'string' && (
            <div className="current-image">
              <p>תמונה נוכחית:</p>
              <img src={`http://localhost:3000/${workshopImage}`} alt="Current Workshop" className="workshop-image" />
            </div>
          )}
          
          <div className="form-group">
            <label>עדכן תמונה חדשה:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <button type="submit" className="submit-button">
            שמור שינויים
          </button>
        </form>
      </div>
    </div>
  );
}
