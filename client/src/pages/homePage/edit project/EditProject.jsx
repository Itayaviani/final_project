import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './EditProject.css';

export default function EditProject() {
  const { projectId } = useParams();
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [projectImages, setProjectImages] = useState(null);
  const [currentImages, setCurrentImages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const fetchProject = async () => {
      try {

        const response = await axios.get(`http://localhost:3000/api/v1/projects/${projectId}`);
        const { name, projectDescription, projectDetails, images } = response.data;
        setProjectName(name);
        setProjectDescription(projectDescription);
        setProjectDetails(projectDetails);
        setCurrentImages(images);
      } catch (error) {
        console.error('אחזור הפרויקט נכשל:', error);
      }
    };

    fetchProject();
  }, [projectId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', projectName);
    formData.append('projectDescription', projectDescription);
    formData.append('projectDetails', projectDetails);

    if (projectImages) {
      formData.append('images', projectImages);
    }

    try {

      await axios.put(`http://localhost:3000/api/v1/projects/${projectId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (error) {
      setError('עדכון הפרויקט נכשל. אנא בדוק את הקלט שלך.');
      console.error('עריכת הפרויקט נכשלה:', error);
    }
  };


  const handleImageChange = (e) => {
    setProjectImages(e.target.files[0]);
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
            <label>:תמונה נוכחית</label>
            {currentImages && currentImages.length > 0 && (
              <div className="current-images">
                {currentImages.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:3000/${image}`}
                    alt={`Project ${index + 1}`}
                    className="current-image"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>:עדכן תמונה חדשה</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="custom-file-input"
            />
          </div>
          <button type="submit" className="submit-button">שמור שינויים</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}
