import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddProject.css'; 

export default function AddProject({ addProject }) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [projectImages, setProjectImages] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

    // פונקציה לטיפול בלחיצה על כפתור שליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault(); // מניעת רענון הדף
    setError(null);

    try {
      // יצירת אובייקט FormData לשליחת נתוני הטופס לשרת
      const formData = new FormData();
      formData.append('name', projectName);
      formData.append('projectDescription', projectDescription);
      formData.append('projectDetails', projectDetails);

      // הוספת כל התמונות שנבחרו (אם קיימות) ל-FormData
      if (projectImages.length > 0) {
        for (let i = 0; i < projectImages.length; i++) {
          formData.append('images', projectImages[i]);
        }
      }

      const response = await axios.post(
        // שליחת בקשת POST לשרת להוספת פרויקט חדש
        'http://localhost:3000/api/v1/projects',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      // קריאה לפונקציה שהועברה כפרופס לשם עדכון רשימת הפרויקטים
      addProject(response.data);

      
      navigate('/');

    } catch (error) {
      console.error('שגיאה בהוספת הפרוייקט:', error.response ? error.response.data : error.message);
      setError('הוספת הפרויקט נכשלה. אנא בדוק את הטופס ונסה שוב.');
    }
  };

  // פונקציה לטיפול בשינוי התמונה בטופס
  const handleImageChange = (e) => {
    setProjectImages(Array.from(e.target.files)); // טיפול בשינוי התמונות
  };

  return (
    <div className="add-project-container">
      <h1>הוספת פרויקט חדש</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>:שם הפרויקט</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>:תיאור הפרויקט</label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="תיאור קצר של הפרויקט"
            required
          ></textarea>
        </div>
        <div>
          <label>:פרטי הפרויקט</label>
          <textarea
            value={projectDetails}
            onChange={(e) => setProjectDetails(e.target.value)}
            placeholder="פרטים מלאים על הפרויקט"
            required
          ></textarea>
        </div>
        <div>
          <label>:תמונה לפרויקט</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} 
          />
        </div>
        <button type="submit">הוסף פרויקט</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
