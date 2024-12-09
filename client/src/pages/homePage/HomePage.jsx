import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEnvelope, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import "./HomePage.css"; 

export default function HomePage({ isAdmin }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //פונקציה אסינכרונית לאחזור רשימת הפרויקטים מהשרת
    const fetchProjects = async () => {
      try {
        //בקשת GET לשרת לקבלת רשימת פרויקטים
        const response = await axios.get("http://localhost:3000/api/v1/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("אחזור הפרויקטים נכשל:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchProjects();
  }, []);

  // פונקציה לטיפול בניווט לעמוד פרטים נוספים של פרויקט מסוים
  const handleDetails = (projectId) => {
    window.location.href = `/project-details/${projectId}`;
  };

  // פונקציה לטיפול בניווט לעמוד עריכת פרויקט מסוים
  const handleEdit = (projectId) => {
    window.location.href = `/edit-project/${projectId}`;
  };

  // פונקציה למחיקת פרויקט
  const handleDelete = async (projectId) => {
    try {
      // בקשת DELETE לשרת למחיקת הפרויקט
      await axios.delete(`http://localhost:3000/api/v1/projects/${projectId}`);
      // עדכון ה-state להסרת הפרויקט מרשימת הפרויקטים
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (error) {
      console.error("מחיקת הפרויקט נכשלה:", error);
    }
  };

  if (loading) {
    return <div>טוען פרויקטים...</div>;
  }

  return (
    <div className="homepage-container">
      
      <header className="header">
        <h1 className="logo">ברוכים הבאים לעולם של יצירה ופיתוח</h1>
        <h1 className="subtitle">ליווי אישי לצמיחה והגשמה עצמית</h1>
      </header>

      
      <div className="introduction-section">
        <h5>נעים להכיר</h5>
        <p>
          אני טלי גל, נשואה ואמא לשלושה, גרה בקיבוץ שדות ים, חיה ונושמת תודעה.
          מלווה אנשים, מנהלים וארגונים בתהליכים תודעתיים ליצירת שינוי מתוך חיבור,
          משמעות ובחירה. חוקרת איך התודעה משפיעה על המציאות הגשמית ועל האופן שבו
          אנו חווים את החיים. עבורי התודעה משנה חיים. התנהלות מתוך תודעה מודעת
          ומתפתחת מאפשרת לי לבחור את נקודת המבט שלי על החיים, להתחבר לאמת
          הפנימית שלי, לקבל את המציאות, לראות שכל מה שקורה הוא לטובה ולהיות
          בעמדת השפעה משמעותית על החיים שלי
        </p>
        <p>
          למדתי ועסקתי במהלך השנים בשני תחומים - הראשון התחום הכלכלי: כלכלה,
          ניהול, בנקאות, השקעות, פיתוח עסקי וניהול כספים; השני עולם הרוח:
          מנהיגות, תקשורת מקרבת, אימון וגישור, טיפול דרך התת מודע, פיתוח
          אירגוני והנחיית קבוצות. הניסיון והידע שצברתי בעולמות החומר והרוח
          אפשרו לי להבין לעומק את הקשר ביניהם. הבנתי שקיים קשר ישיר ורב השפעה
          בין התהליכים התודעתיים שאנו עוברים למציאות שאנו פוגשים
        </p>
        <p>
          מאז אני עוסקת בקידום סינרגיה בין התודעה למציאות. אני מלווה אנשים,
          מנהלים, קהילות וארגונים בתהליכי התפתחות והגשמה ועוזרת לאנשים להתחבר
          לעצמם ולהרחיב את הביטוי ע"י אהבה עצמית והוויה חופשית. מחכה לפגוש
          אתכם בתהליך אישי, קבוצתי או אצלכם בארגון🤍
        </p>
      </div>

      <h4>:הצצה לפרויקטים</h4>

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
              
              <p>{project.projectDescription}</p>

              
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

      
      <footer id="contact" className="footer">
        <h2>צור קשר</h2>
        <h3>!בואו נדבר - אני כאן בשבילכם</h3>
        <h3>זקוקים למידע נוסף על תהליך אישי שמתאים לכם? מתעניינים בקורס או סדנה ורוצים לקבל פרטים נוספים? יש לכם שאלות בנוגע לרכישה או תהליך הרשמה - אני זמינה כאן לכל צורך</h3>
        <div className="contact-list">
          <div className="contact-item mail">
            <FaEnvelope className="contact-icon" />
            <p><a href="mailto:taligal12@gmail.com">taligal12@gmail.com</a></p>
          </div>
          <div className="contact-item whatsapp">
            <FaWhatsapp className="contact-icon" />
            <p><a href="https://wa.me/972523829170" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
          </div>
          <div className="contact-item facebook">
            <FaFacebook className="contact-icon" />
            <p><a href="https://www.facebook.com/share/LQ1PZB68oyWhib3g/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer">Facebook</a></p>
          </div>
          <div className="contact-item instagram">
            <FaInstagram className="contact-icon" />
            <p><a href="https://www.instagram.com/taligal12" target="_blank" rel="noopener noreferrer">Instagram</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
