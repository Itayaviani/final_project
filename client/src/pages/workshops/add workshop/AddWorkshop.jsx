import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddWorkshop.css'; // ייבוא קובץ ה-CSS

export default function AddWorkshop({ addWorkshop }) {
  const [workshopName, setWorkshopName] = useState('');
  const [workshopDescription, setWorkshopDescription] = useState('');
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopImage, setWorkshopImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(workshopName, workshopDescription, workshopPrice, workshopImage);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/workshops',
        { name: workshopName, description: workshopDescription, price: workshopPrice, image: workshopImage }
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
