import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // ייבוא axios לביצוע בקשות HTTP
import './coursePayment.css'; // ייבוא עיצוב מתאים

export default function CoursePayment() {
  const { courseId } = useParams(); // קבלת מזהה הקורס שנרכש מהנתיב
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [selectedCardType, setSelectedCardType] = useState(''); // מצב הכפתור הנבחר (ויזה או מאסטרקארד)
  const [installments, setInstallments] = useState(1); // כמות התשלומים, ברירת מחדל 1
  const [isCourseFull, setIsCourseFull] = useState(false); // סטטוס האם הקורס מלא
  const [participants, setParticipants] = useState(0); // מספר המשתתפים הנוכחי
  const [capacity, setCapacity] = useState(0); // תפוסה מקסימלית של הקורס

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    creditCard: '',
    expirationDate: '',
    cvv: '',
    cardType: '',
  });

  const [submitted, setSubmitted] = useState(false); // משתנה לבדיקת אם המשתמש ניסה לשלוח את הטופס
  const [isFormValid, setIsFormValid] = useState(false); // סטטוס תקינות הטופס

  // פונקציה לוודא תקינות כל השדות
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const fullNameRegex = /^[A-Za-z\u0590-\u05FF\s]+$/;

    const newErrors = {
      fullName: !fullNameRegex.test(fullName) && fullName.length > 0 ? 'שם מלא יכול להכיל רק אותיות בעברית או באנגלית ורווחים.' : '',
      email: !emailRegex.test(email) && email.length > 0 ? 'כתובת אימייל לא תקינה. יש להזין כתובת מלאה כולל הסיומת.' : '',
      creditCard: creditCard.length !== 16 && creditCard.length > 0 ? 'מספר כרטיס האשראי חייב להכיל 16 ספרות.' : '',
      expirationDate: (expirationDate.length !== 5 || !expirationDate.includes('/')) && expirationDate.length > 0 ? 'תוקף הכרטיס חייב להיות בפורמט MM/YY.' : '',
      cvv: cvv.length !== 3 && cvv.length > 0 ? 'CVV חייב להכיל 3 ספרות.' : '',
      cardType: !selectedCardType ? 'יש לבחור אמצעי תשלום (ויזה או מאסטרקארד).' : '',
    };

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.email && !newErrors.creditCard && !newErrors.expirationDate && !newErrors.cvv;
  };

  // בדיקת תקינות טופס
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [fullName, email, creditCard, expirationDate, cvv, selectedCardType]);

  // קבלת פרטי הקורס
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/courses/${courseId}`);
        const course = response.data;

        setParticipants(course.participants);
        setCapacity(course.capacity);
        setIsCourseFull(course.participants >= course.capacity); // בדיקה אם הקורס מלא
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

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

  const handleCardTypeSelect = (type) => {
    setSelectedCardType(type); // עדכון אמצעי התשלום הנבחר
  };

  // פונקציה לאיפוס הטופס
  const resetForm = () => {
    setFullName('');
    setEmail('');
    setCreditCard('');
    setExpirationDate('');
    setCvv('');
    setSelectedCardType('');
    setInstallments(1); // איפוס כמות התשלומים
  };

  // פונקציה לשליחת הנתונים לשרת
  const handlePurchase = async (purchaseData) => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/courses/purchase', purchaseData);

      // בדוק אם הקורס כבר נרכש על פי תגובת השרת
      if (response.data.purchased) {
        alert('כבר רכשת את הקורס הזה.'); // הצגת הודעה למשתמש
        resetForm();
      } else {
        console.log('Purchase successful:', response.data);
        alert('הרכישה בוצעה בהצלחה!');
        navigate('/thank-you'); // ניתוב לדף תודה לאחר הצלחת התשלום
      }
    } catch (error) {
      console.error('Error making purchase:', error);

      // בדוק את הסטטוס של השגיאה שהתקבלה מהשרת
      if (error.response && error.response.status === 400) {
        alert('הקורס מלא, לא ניתן לבצע רכישה נוספת.');
      } else if (error.response && error.response.status === 404) {
        alert('לא נמצא הקורס או המשתמש.');
      } else {
        alert('אירעה שגיאה בעת ביצוע הרכישה, אנא נסה שוב מאוחר יותר.');
      }
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setSubmitted(true); // סימון שנשלח הטופס

    // בדיקה אם כל שדות הקלט תקינים, אך אם אמצעי תשלום לא נבחר, יש להציג הודעת שגיאה
    if (!selectedCardType) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardType: 'יש לבחור אמצעי תשלום (ויזה או מאסטרקארד).',
      }));
    }

    if (isFormValid && selectedCardType && !isCourseFull) {
      const purchaseData = {
        fullName,
        email,
        courseId,
        installments, // הוספת כמות התשלומים לנתונים הנשלחים לשרת
      };

      handlePurchase(purchaseData); // קריאה לפונקציה ששולחת את הנתונים לשרת
    }
  };

  return (
    <div className="payment-page-container">
      <h1>הכנס פרטי תשלום</h1>
      {isCourseFull && <p className="error">הקורס מלא. לא ניתן לבצע רכישה נוספת.</p>}
      <form onSubmit={handlePayment} className="payment-form">

        {/* שדות שם מלא ואימייל */}
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

        {/* כפתורי ויזה ומאסטרקארד */}
        <div className="card-type-selection">
          <button
            type="button"
            className={`card-type-button ${selectedCardType === 'visa' ? 'selected' : ''}`}
            onClick={() => handleCardTypeSelect('visa')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" />
          </button>
          <button
            type="button"
            className={`card-type-button ${selectedCardType === 'mastercard' ? 'selected' : ''}`}
            onClick={() => handleCardTypeSelect('mastercard')}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="MasterCard" />
          </button>
        </div>

        {/* הצגת שגיאה אם לא נבחר כרטיס רק לאחר ניסיון תשלום */}
        {submitted && !selectedCardType && <span className="card-error">{errors.cardType}</span>}

        {/* שדות נוספים של כרטיס אשראי */}
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

        {/* בחירת מספר תשלומים, מוצג תמיד */}
        <div className="form-group">
          <label>כמות תשלומים:</label>
          <select value={installments} onChange={(e) => setInstallments(e.target.value)}>
            {[...Array(12).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>{n + 1}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid || isCourseFull} // מניעת לחיצה אם הקורס מלא
        >
          בצע תשלום
        </button>
      </form>
    </div>
  );
}
