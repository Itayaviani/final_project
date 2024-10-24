import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProject.css'; // ייבוא קובץ ה-CSS

export default function AddProject({ addProject }) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [projectImages, setProjectImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // הפונקציה לטיפול בהוספת הפרויקט
  const handleSubmit = async (e) => {
    e.preventDefault(); // מניעת רענון הדף
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', projectName);
      formData.append('projectDescription', projectDescription);
      formData.append('projectDetails', projectDetails);

      // הוספת התמונות אם קיימות
      if (projectImages.length > 0) {
        for (let i = 0; i < projectImages.length; i++) {
          formData.append('images', projectImages[i]);
        }
      }

      const response = await axios.post(
        'http://localhost:3000/api/v1/projects',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      // עדכון הפרויקט החדש
      addProject(response.data);

      // ניווט חזרה לדף הבית או הצגת הפרויקטים
      navigate('/');

    } catch (error) {
      console.error('Failed to add project:', error.response ? error.response.data : error.message);
      setError('Failed to add project. Please check the form and try again.');
    }
  };

  const handleImageChange = (e) => {
    setProjectImages(Array.from(e.target.files)); // טיפול בשינוי התמונות
  };

  return (
    <div className="add-project-container">
      <h1>הוספת פרויקט חדש</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>שם הפרויקט:</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>תיאור הפרויקט:</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="תיאור קצר של הפרויקט"
            required
          ></textarea>
        </div>
        <div>
          <label>פרטי הפרויקט:</label>
          <textarea
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            placeholder="פרטים מלאים על הפרויקט"
            required
          ></textarea>
        </div>
        <div>
          <label>תמונות לפרויקט:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange} // תמיכה בהעלאת מספר תמונות
          />
        </div>
        <button type="submit">הוסף פרויקט</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
