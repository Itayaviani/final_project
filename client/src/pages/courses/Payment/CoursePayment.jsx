import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './coursePayment.css'; // ייבוא עיצוב מתאים

export default function CoursePayment() {
  const { courseId } = useParams(); // קבלת מזהה הקורס שנרכש מהנתיב
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    creditCard: '',
    expirationDate: '',
    cvv: '',
  });

  const [isFormValid, setIsFormValid] = useState(false); // סטטוס תקינות הטופס

  // פונקציה לוודא תקינות כל השדות
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // אימות אימייל בפורמט example@example.com או example@example.co.il
    const fullNameRegex = /^[A-Za-z\u0590-\u05FF\s]+$/; // אימות שהשם המלא מכיל רק אותיות בעברית/אנגלית ורווחים

    const newErrors = {
      fullName: !fullNameRegex.test(fullName) && fullName.length > 0 ? 'שם מלא יכול להכיל רק אותיות בעברית או באנגלית ורווחים.' : '',
      email: !emailRegex.test(email) && email.length > 0 ? 'כתובת אימייל לא תקינה. יש להזין כתובת מלאה כולל הסיומת.' : '',
      creditCard: creditCard.length !== 16 && creditCard.length > 0 ? 'מספר כרטיס האשראי חייב להכיל 16 ספרות.' : '',
      expirationDate: (expirationDate.length !== 5 || !expirationDate.includes('/')) && expirationDate.length > 0 ? 'תוקף הכרטיס חייב להיות בפורמט MM/YY.' : '',
      cvv: cvv.length !== 3 && cvv.length > 0 ? 'CVV חייב להכיל 3 ספרות.' : '',
    };

    setErrors(newErrors);

    // הטופס תקין אם אין הודעות שגיאה
    return !newErrors.fullName && !newErrors.email && !newErrors.creditCard && !newErrors.expirationDate && !newErrors.cvv;
  };

  // עדכון סטטוס הטופס בכל שינוי של שדה
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [fullName, email, creditCard, expirationDate, cvv]);

  const handleCreditCardChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // מחיקת כל דבר שאינו מספר
    if (value.length <= 16) {
      setCreditCard(value);
    }
  };

  const handleExpirationDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // מחיקת כל דבר שאינו מספר
    if (value.length <= 4) {
      if (value.length >= 3) {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}`; // הוספת "/" בין הספרות
      }
      setExpirationDate(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // מחיקת כל דבר שאינו מספר
    if (value.length <= 3) {
      setCvv(value);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();

    // בדיקת תקינות הטופס לפני שליחת התשלום
    if (isFormValid) {
      // תוכל להוסיף כאן את הלוגיקה שלך לשליחת נתוני התשלום לשרת
      console.log(`המשתמש ${fullName} רוכש את הקורס עם מזהה ${courseId}`);

      // לאחר הצלחת התשלום, ניתוב לדף תודה
      navigate('/thank-you'); // ניתוב לדף תודה
    }
  };

  return (
    <div className="payment-page-container">
      <h1>הכנס פרטי תשלום</h1>
      <form onSubmit={handlePayment} className="payment-form">
        <div className="form-group">
          <label>שם מלא:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {errors.fullName ? (
            <span className="error">{errors.fullName}</span>
          ) : fullName.length > 0 && (
            <span className="success">✔</span>
          )}
        </div>
        <div className="form-group">
          <label>אימייל:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email ? (
            <span className="error">{errors.email}</span>
          ) : email.length > 0 && (
            <span className="success">✔</span>
          )}
        </div>
        <div className="form-group">
          <label>מספר כרטיס אשראי:</label>
          <input
            type="text"
            value={creditCard}
            onChange={handleCreditCardChange}
            required
          />
          {errors.creditCard ? (
            <span className="error">{errors.creditCard}</span>
          ) : creditCard.length === 16 && (
            <span className="success">✔</span>
          )}
        </div>
        <div className="form-group">
          <label>תוקף כרטיס:</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={expirationDate}
            onChange={handleExpirationDateChange}
            required
          />
          {errors.expirationDate ? (
            <span className="error">{errors.expirationDate}</span>
          ) : expirationDate.length === 5 && expirationDate.includes('/') && (
            <span className="success">✔</span>
          )}
        </div>
        <div className="form-group">
          <label>CVV:</label>
          <input
            type="text"
            value={cvv}
            onChange={handleCvvChange}
            required
          />
          {errors.cvv ? (
            <span className="error">{errors.cvv}</span>
          ) : cvv.length === 3 && (
            <span className="success">✔</span>
          )}
        </div>
        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid}
        >
          בצע תשלום
        </button>
      </form>
    </div>
  );
}
