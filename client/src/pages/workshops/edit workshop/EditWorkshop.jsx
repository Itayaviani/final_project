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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/workshops/${workshopId}`);
        const { name, description, price, image } = response.data;
        setWorkshopName(name);
        setWorkshopDescription(description);
        setWorkshopPrice(price);
        setWorkshopImage(image);
      } catch (error) {
        console.error('Failed to fetch workshop:', error);
      }
    };

    fetchWorkshop();
  }, [workshopId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/api/v1/workshops/${workshopId}`, {
        name: workshopName,
        description: workshopDescription,
        price: workshopPrice,
        image: workshopImage,
      });
      
      navigate('/workshops');
    } catch (error) {
      console.error('Failed to edit workshop:', error);
    }
  };

  const handleImageChange = (e) => {
    setWorkshopImage(e.target.value);
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
            <label>תמונה לסדנא:</label>
            <input
              type="text"
              value={workshopImage}
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-button">שמור שינויים</button>
        </form>
      </div>
    </div>
  );
}
