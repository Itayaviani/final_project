import React from 'react';
import { FaEnvelope, FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import './personalProcess.css';

function PersonalProcess() {
    return (
        <div className="personal-process-container">
            <section id="about" className="content-section">
                <h2>קצת עלי</h2>
                <p>
                    מאמנת לתודעה ומנהיגות, מנחת קבוצות, שחקנית ויוצרת. חוקרת את הקשר בין נקודת המבט לחוויית החיים.
                    מלווה אנשים, מנהלים, קהילות וארגונים בתהליכים ליצירת התפתחות והגשמה.
                    עוזרת לאנשים להתחבר לעצמם ולהרחיב את הביטוי ע"י אהבה עצמית והוויה חופשית.
                </p>
            </section>

            <section id="process" className="content-section">
                <h2>תהליך אישי ליצירת שינוי מתוך משמעות</h2>
                <p>
                    התהליך כולל 12 פגישות אישיות מובנות בהן נפתח תודעה שתאפשר לך לזהות את הרצונות האמיתיים שלך,
                    לשחרר מהתת מודע חסימות ואמונות מגבילות, לחוות את החיים ממקום של בחירה,
                    לאהוב ולהאמין בעצמך, ולנהל שגרה יומיומית של מציאות מיטיבה.
                </p>
            </section>

            <section id="contact" className="content-section">
                <h2>צור קשר</h2>
                <p>מחכה לפגוש אותך, טלי גל</p>
                <div className="contact-item">
                    <FaEnvelope className="contact-icon" />
                    <p>דוא"ל: <a href="mailto:taligal12@gmail.com">taligal12@gmail.com</a></p>
                </div>
                <div className="contact-item">
                    <FaWhatsapp className="contact-icon" />
                    <p>WhatsApp: <a href="https://wa.me/972523829170" target="_blank" rel="noopener noreferrer">לחץ כאן</a></p>
                </div>
                <div className="contact-item">
                    <FaFacebook className="contact-icon" />
                    <p>Facebook: <a href="https://www.facebook.com/share/LQ1PZB68oyWhib3g/?mibextid=qi2Omg" target="_blank" rel="noopener noreferrer">עקוב אחרי</a></p>
                </div>
                <div className="contact-item">
                    <FaInstagram className="contact-icon" />
                    <p>Instagram: <a href="https://www.instagram.com/taligal12?utm_source=qr&igsh=MWwzb2w5NHNkdnp0Yg==" target="_blank" rel="noopener noreferrer">עקוב אחרי</a></p>
                </div>
            </section>
        </div>
    );
}

export default PersonalProcess;
