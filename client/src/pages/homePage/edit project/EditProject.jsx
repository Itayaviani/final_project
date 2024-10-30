import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditProject.css'; // ייבוא קובץ ה-CSS

export default function EditProject() {
  const { projectId } = useParams(); // שימוש במזהה הפרויקט מהנתיב
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState(''); // תיאור קצר של הפרויקט
  const [projectDetails, setProjectDetails] = useState(''); // פרטי הפרויקט המלאים
  const [projectImages, setProjectImages] = useState([]); // תמונות חדשות
  const [currentImages, setCurrentImages] = useState([]); // תמונות נוכחיות
  const [error, setError] = useState(''); // לניהול הודעות שגיאה
  const navigate = useNavigate();

  useEffect(() => {
    // פונקציה לשליפת פרטי הפרויקט לפי מזהה
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/projects/${projectId}`);
        const { name, projectDescription, projectDetails, images } = response.data;
        setProjectName(name);
        setProjectDescription(projectDescription);
        setProjectDetails(projectDetails);
        setCurrentImages(images); // הצגת התמונות הנוכחיות
      } catch (error) {
        console.error('Failed to fetch project:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // מניעת רענון הדף

    const formData = new FormData();
    formData.append('name', projectName);
    formData.append('projectDescription', projectDescription);
    formData.append('projectDetails', projectDetails);

    if (projectImages.length > 0) {
      for (let i = 0; i < projectImages.length; i++) {
        formData.append('images', projectImages[i]);
      }
    }

    try {
      await axios.put(`http://localhost:3000/api/v1/projects/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // עדכון בקשה עם תמונות
        },
      });

      navigate('/'); // ניתוב חזרה לעמוד הבית לאחר עדכון מוצלח
    } catch (error) {
      setError('Failed to update project. Please check your input.'); // טיפול בשגיאה
      console.error('Failed to edit project:', error);
    }
  };

  const handleImageChange = (e) => {
    setProjectImages(Array.from(e.target.files)); // הגדרת תמונות חדשות
  };

  return (
    <div className="edit-project-wrapper">
      <div className="edit-project-container">
        <h1>עריכת פרויקט</h1>
        <form onSubmit={handleSubmit} className="edit-project-form">
          <div className="form-group">
            <label>:שם הפרויקט</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>:תיאור הפרויקט</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>:פרטי הפרויקט</label>
            <textarea
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>:תמונות נוכחיות</label>
            {currentImages && currentImages.length > 0 && (
              <div className="current-images">
                {currentImages.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000/${image}`}
                    alt={`Project ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>:עדכן תמונות חדשות</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-button">שמור שינויים</button>
        </form>
        {error && <p className="error-message">{error}</p>} {/* הצגת הודעת שגיאה */}
      </div>
    </div>
  );
}
