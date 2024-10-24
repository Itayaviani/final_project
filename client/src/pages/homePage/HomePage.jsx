import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./HomePage.css"; // ייבוא קובץ ה-CSS אם קיים

export default function HomePage({ isAdmin }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/projects"); // ודא שכתובת ה-API נכונה
        setProjects(response.data); // עדכון רשימת הפרויקטים במצב
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false); // הפסקת מצב טעינה
      }
    };

    fetchProjects();
  }, []);

  const handleDetails = (projectId) => {
    window.location.href = `/project-details/${projectId}`;
  };

  const handleEdit = (projectId) => {
    window.location.href = `/edit-project/${projectId}`;
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/projects/${projectId}`);
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  if (loading) {
    return <div>טוען פרויקטים...</div>;
  }

  return (
    <div>
      <h1>הפרויקטים שלי</h1>

      {isAdmin && (
        <div className="add-project-button-container">
          <Link to="/add-project" className="add-project-button">
            הוסף פרויקט חדש
          </Link>
        </div>
      )}

      <div className="projects-container">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="project-card">
              <h3>{project.name}</h3>
              {project.images && project.images.length > 0 && (
                <img
                  src={`http://localhost:3000/${project.images[0]}`}
                  alt={project.name}
                />
              )}
              {/* הצגת תיאור הפרויקט בלבד */}
              <p>{project.projectDescription}</p>

              {/* כפתור פרטים נוספים שיפנה לעמוד פרטי הפרויקט */}
              <button
                onClick={() => handleDetails(project._id)}
                className="details-button"
              >
                פרטים נוספים
              </button>

              {isAdmin && (
                <div className="project-actions">
                  <button
                    onClick={() => handleEdit(project._id)}
                    className="edit-button"
                  >
                    ערוך
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="delete-button"
                  >
                    מחק
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>אין פרויקטים להצגה</p>
        )}
      </div>
    </div>
  );
}
