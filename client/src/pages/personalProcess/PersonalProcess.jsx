import React from 'react';
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
                <p>טלפון: 052-3829170</p>
                <p>דוא"ל: <a href="mailto:taligal12@gmail.com">taligal12@gmail.com</a></p>
                <p>WhatsApp: <a href="https://wa.me/972523829170" target="_blank">לחץ כאן</a></p>
                <p>Facebook: <a href="https://www.facebook.com/share/LQ1PZB68oyWhib3g/?mibextid=qi2Omg" target="_blank">עקוב אחרי</a></p>
                <p>Instagram: <a href="https://www.instagram.com/taligal12?utm_source=qr&igsh=MWwzb2w5NHNkdnp0Yg==" target="_blank">עקוב אחרי</a></p>
            </section>
        </div>
    );
}

export default PersonalProcess;
