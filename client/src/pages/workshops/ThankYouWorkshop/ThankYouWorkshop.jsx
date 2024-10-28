import React from 'react';
import './thankYouWorkshop.css';

export default function ThankYouWorkshop() {
  return (
    <div className="thank-you-container-workshop">
      <h1>!תודה על הרכישה</h1>
      <p>.הרכישה בוצעה בהצלחה, מייל עם פרטי הרכישה נשלח אליך</p>
      <p>.אם יש לך שאלות נוספות, ניתן לפנות אלינו בדף צור קשר</p>
      <button onClick={() => window.location.href = '/workshops'} className="back-button-workshop">
        חזרה לסדנאות
      </button>
    </div>
  );
}
