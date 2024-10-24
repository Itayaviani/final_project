import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProjectDetails.css'; // ייבוא קובץ ה-CSS לעיצוב

export default function ProjectDetails() {
  const { projectId } = useParams(); // שימוש ב-useParams לקבלת ה-projectId מהנתיב
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/projects/${projectId}`);
        setProject(response.data);
      } catch (error) {
        console.error('Failed to fetch project details:', error);
      }
    };

    fetchProject();
  }, [projectId]);

  if (!project) {
    return <p>טוען פרטים...</p>;
  }

  return (
    <div className="project-details-container">
      <h1>שם: {project.name}</h1>
      {project.images && project.images.length > 0 && (
        <img src={`http://localhost:3000/${project.images[0]}`} alt={project.name} className="project-image" />
      )}

      {/* הצגת פרטי הפרויקט המלאים */}
      <div className="project-details-content">
        <p>{project.projectDetails}</p>
      </div>
    </div>
  );
}
