import React from 'react';
import './thankYouCourse.css';

export default function ThankYou() {
  return (
    <div className="thank-you-container-course">
      <div className="thank-you-box">
        <h1>!תודה על הרכישה</h1>
        <p>.הרכישה בוצעה בהצלחה, מייל עם פרטי הרכישה נשלח אליך</p>
        <p>.אם יש לך שאלות נוספות, ניתן לפנות אלינו בדף צור קשר</p>
        <button onClick={() => window.location.href = '/courses'} className="back-button-course">
          חזרה לקורסים
        </button>
      </div>
    </div>
  );
}
