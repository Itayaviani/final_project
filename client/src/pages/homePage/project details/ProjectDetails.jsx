import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProjectDetails.css';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {

    const fetchProject = async () => {
      try {

        const response = await axios.get(`http://localhost:3000/api/v1/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('אחזור פרטי הפרויקט נכשל:', error);
      }
    };

    fetchProject();
  }, [projectId]);


  const splitTextIntoParagraphs = (text) => {
    const words = text.split(' ');
    const paragraphs = [];
    for (let i = 0; i < words.length; i += 200) {

      const paragraph = words.slice(i, i + 200).join(' ').trim();
      if (paragraph) {
        paragraphs.push(paragraph);
      }
    }
    return paragraphs;
  };


  if (!project) {
    return <p>טוען פרטים...</p>;
  }


  const detailsParagraphs = splitTextIntoParagraphs(project.projectDetails || '');

  return (
    <div className="project-details-container">
      <h1>שם הפרויקט: {project.name}</h1>
      {project.images && project.images.length > 0 && (
        <img src={`http://localhost:3000/${project.images[0]}`} alt={project.name} className="project-image" />
      )}

      {}
      <div className="project-text-section">
        {detailsParagraphs.map((paragraph, index) => (
          <div key={`details-${index}`} className="project-text-box">
            <p>{paragraph}</p>
          </div>
        ))}
      </div>
      
      
      <button onClick={() => navigate('/')} className="back-button">חזרה לפרויקטים</button>
    </div>
  );
}
