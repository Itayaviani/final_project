import React from 'react';
import { FaEnvelope, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import './personalProcess.css';

// ייבוא התמונות מהתיקייה pictures
import photo1 from './pictures/photo1.jpg';
import photo2 from './pictures/photo2.jpg';
import photo3 from './pictures/photo3.jpg';

function PersonalProcess() {
    return (
        <div className="personal-process-container">
            {/* כותרת ולוגו */}
            <header className="header">
                <h1 className="logo">תהליך אישי</h1>
                <h1 className="subtitle">ליווי אישי לצמיחה והגשמה עצמית</h1>
            </header>

            {/* עלי */}
            <section id="about" className="content-section">
                <div className="content-layout">
                    <div className="text-content">
                        <h2>קצת עלי</h2>
                        <p>
                            מאמנת לתודעה ומנהיגות, מנחת קבוצות, שחקנית ויוצרת. חוקרת את הקשר בין נקודת המבט לחוויית החיים.
                            מלווה אנשים, מנהלים, קהילות וארגונים בתהליכים ליצירת התפתחות והגשמה.
                            עוזרת לאנשים להתחבר לעצמם ולהרחיב את הביטוי ע"י אהבה עצמית והוויה חופשית
                        </p>
                    </div>
                    <div className="image-content">
                        <img src={photo2} alt="תמונה 2" className="personal-image" />
                    </div>
                </div>
            </section>

            {/* תהליך אישי */}
            <section id="process" className="content-section">
                <h2>תהליך אישי ליצירת שינוי מתוך משמעות</h2>
                <div className="content-layout">
                    <div className="image-content">
                        <img src={photo1} alt="תמונה 1" className="personal-image" />
                    </div>
                    <div className="text-content">
                        <p>התהליך כולל 12 פגישות אישיות מובנות בהן נפתח תודעה שתאפשר לך</p>
                        <ul>
                            <li>לחוות את החיים ממקום של בחירה</li>
                            <li>לזהות את הרצונות האמיתיים שלך</li>
                            <li>לאהוב ולהאמין בעצמך</li>
                            <li>לשחרר מהתת מודע חסימות ואמונות מגבילות</li>
                            <li>לנהל שגרה יומיומית של מציאות מיטיבה</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* כוח פנימי */}
            <section id="insight" className="content-section insight-section">
                <h2>הידעת? יש לך כוח עצום על החיים שלך</h2>
                <p>
                    לכל אחד מאתנו יש ניגון רגשי שפועם בתוכו.
                    בניגון הרגשי שלנו פועמים רגשות נעימים ורגשות כואבים.
                    את הניגון הרגשי אנו חווים במהלך החיים שלנו כמו תקליט חוזר,
                    המשמר את עצמו באמצעות אמונות שחבויות בתת מודע שלנו.
                    בכדי לשנות את חווית החיים שלנו עלינו לשנות את הניגון הרגשי
                </p>
            </section>

            {/* הנהגת החיים */}
            <section id="leadership" className="content-section">
                <div className="content-layout">
                    <div className="text-content">
                        <h2>הכוח להנהיג את החיים שלנו</h2>
                        <ul>
                            <li>לקחת את המושכות לידיים שלנו</li>
                            <li>להנהיג את החיים שלנו</li>
                            <li>להוביל את עצמנו למקום שבו אנו רוצים להיות</li>
                        </ul>
                    </div>
                    <div className="image-content">
                        <img src={photo3} alt="תמונה 3" className="personal-image" />
                    </div>
                </div>
            </section>

            {/* צור קשר */}
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

export default PersonalProcess;
