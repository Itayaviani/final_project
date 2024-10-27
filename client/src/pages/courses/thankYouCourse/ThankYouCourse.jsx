import React from 'react';
import './thankYouCourse.css';

export default function ThankYou() {
  return (
    <div className="thank-you-container-course">
      <h1>תודה על הרכישה!</h1>
      <p>הרכישה בוצעה בהצלחה, מייל עם פרטי הרכישה נשלח אליך.</p>
      <p>אם יש לך שאלות נוספות, ניתן לפנות לשירות הלקוחות שלנו.</p>
      <button onClick={() => window.location.href = '/courses'} className="back-button-course">
        חזרה לקורסים
      </button>
    </div>
  );
}
