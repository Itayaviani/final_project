import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './workshopPayment.css'; // ייבוא עיצוב מתאים

export default function WorkshopPayment() {
  const { workshopId } = useParams(); // קבלת מזהה הסדנה מהנתיב
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [creditCard, setCreditCard] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [idNumber, setIdNumber] = useState(''); // תעודת זהות
  const [selectedCardType, setSelectedCardType] = useState(''); // מצב הכפתור הנבחר (ויזה או מאסטרקארד)
  const [installments, setInstallments] = useState(1); // כמות תשלומים ברירת מחדל 1

  const [hasWorkshopStarted, setHasWorkshopStarted] = useState(false); // סטטוס אם הסדנה התחילה
  const [isWorkshopFull, setIsWorkshopFull] = useState(false); // סטטוס אם הסדנה מלאה

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    creditCard: '',
    expirationDate: '',
    cvv: '',
    idNumber: '', // שדה שגיאה עבור תעודת זהות
    cardType: '', // שדה שגיאה עבור סוג הכרטיס
  });

  const [submitted, setSubmitted] = useState(false); // משתנה לבדיקת אם המשתמש ניסה לשלוח את הטופס
  const [isFormValid, setIsFormValid] = useState(false); // סטטוס תקינות הטופס

  useEffect(() => {
    const fetchWorkshopDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/workshops/${workshopId}`);
        const workshop = response.data;

        // בדיקת אם הסדנה כבר התחילה
        const today = new Date();
        today.setHours(0, 0, 0, 0); // התאמה להשוואה לפי תאריך בלבד
        const startDate = new Date(workshop.startDate);
        startDate.setHours(0, 0, 0, 0);
        setHasWorkshopStarted(startDate <= today);

        // בדיקת אם הסדנה מלאה
        setIsWorkshopFull(workshop.participants >= workshop.capacity);
      } catch (error) {
        console.error('Error fetching workshop details:', error);
      }
    };

    fetchWorkshopDetails();
  }, [workshopId]);

  // פונקציה לוודא תקינות כל השדות, כולל בחירת סוג כרטיס אשראי ותעודת זהות
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const fullNameRegex = /^[A-Za-z\u0590-\u05FF\s]+$/;
    const idNumberRegex = /^\d{9}$/; // תעודת זהות בת 9 ספרות בלבד

    const newErrors = {
      fullName: !fullNameRegex.test(fullName) && fullName.length > 0 ? 'שם מלא יכול להכיל רק אותיות בעברית או באנגלית ורווחים.' : '',
      email: !emailRegex.test(email) && email.length > 0 ? 'כתובת אימייל לא תקינה. יש להזין כתובת מלאה כולל הסיומת.' : '',
      creditCard: creditCard.length !== 16 && creditCard.length > 0 ? 'מספר כרטיס האשראי חייב להכיל 16 ספרות.' : '',
      expirationDate: (expirationDate.length !== 5 || !expirationDate.includes('/')) && expirationDate.length > 0 ? 'תוקף הכרטיס חייב להיות בפורמט MM/YY.' : '',
      cvv: cvv.length !== 3 && cvv.length > 0 ? 'CVV חייב להכיל 3 ספרות.' : '',
      idNumber: !idNumberRegex.test(idNumber) && idNumber.length > 0 ? 'תעודת זהות חייבת להכיל 9 ספרות.' : '',
      cardType: !selectedCardType ? 'יש לבחור אמצעי תשלום (ויזה או מאסטרקארד).' : '', // בדיקת שגיאה עבור סוג הכרטיס
    };

    setErrors(newErrors);

    // הטופס תקין אם כל השדות תקינים
    return !Object.values(newErrors).some((error) => error);
  };

  // עדכון תקינות הטופס בכל שינוי בשדות
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [fullName, email, creditCard, expirationDate, cvv, idNumber, selectedCardType]);

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

  const handleIdNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // מחיקת כל דבר שאינו מספר
    if (value.length <= 9) {
      setIdNumber(value);
    }
  };

  const handleCardTypeSelect = (type) => {
    setSelectedCardType(type); // עדכון סוג הכרטיס הנבחר (ויזה/מאסטרקארד)
  };

  const handlePurchase = async () => {
    const purchaseData = {
      fullName,
      email,
      workshopId, // ודא שזה workshopId ולא courseId
      installments, // כמות התשלומים נשלחת כחלק מהנתונים
      idNumber, // שליחת תעודת הזהות כחלק מהנתונים
    };

    try {
      const response = await axios.post('http://localhost:3000/api/v1/workshops/purchase', purchaseData);

      // בדיקת רכישה כפולה
      if (response.data.purchased) {
        alert('כבר רכשת את הסדנה הזו.');
        resetForm(); // איפוס הטופס לאחר הרכישה
      } else {
        console.log('Purchase successful:', response.data);
        alert('הרכישה בוצעה בהצלחה!');
        navigate('/thank-you-workshop'); // ניתוב לדף תודה לסדנאות לאחר הצלחת התשלום

      }
    } catch (error) {
      console.error('Error making purchase:', error);

      if (error.response && error.response.status === 400) {
        alert("לא ניתן לבצע רכישה, סדנה זאת מלאה.");
        navigate('/workshops'); // ניתוב חזרה לעמוד הסדנאות לאחר לחיצה על אישור ב-alert
      } else if (error.response && error.response.status === 404) {
        alert('לא נמצאה הסדנה או המשתמש.');
      } else {
        alert('אירעה שגיאה בעת ביצוע הרכישה, אנא נסה שוב מאוחר יותר.');
      }
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setSubmitted(true); // סימון שנשלח הטופס

    // אם לא נבחר סוג כרטיס, לאפשר לחיצה אך למנוע רכישה ולהציג את ההודעה
    if (!selectedCardType) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        cardType: 'יש לבחור אמצעי תשלום (ויזה או מאסטרקארד).',
      }));
      return;
    }

    // בדיקה אם הסדנה מלאה
    if (isWorkshopFull) {
      alert('לא ניתן לבצע רכישה, סדנה זאת מלאה.');
      navigate('/workshops'); // ניתוב לעמוד הסדנאות לאחר לחיצה על "אישור"
      return;
    }

    // בדיקה אם הסדנה התחילה
    if (hasWorkshopStarted) {
      alert('לא ניתן לבצע רכישה, סדנה זאת התחילה.');
      navigate('/workshops'); // ניתוב לעמוד הסדנאות לאחר לחיצה על "אישור"
      return;
    }

    // אם כל השדות תקינים, בצע את הרכישה
    if (isFormValid && selectedCardType) {
      handlePurchase(); // קריאה לפונקציה ששולחת את הנתונים לשרת
    }
  };

  // פונקציה לאיפוס הטופס לאחר רכישה
  const resetForm = () => {
    setFullName('');
    setEmail('');
    setCreditCard('');
    setExpirationDate('');
    setCvv('');
    setIdNumber('');
    setSelectedCardType('');
    setInstallments(1); // איפוס כמות התשלומים לברירת מחדל
  };

  return (
    <div className="payment-page-container">
      <h1>הכנס פרטי תשלום</h1>
      <form onSubmit={handlePayment} className="payment-form">
        <div className="form-group">
          <label>:שם מלא</label>
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
          <label>:אימייל</label>
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

        <div className="form-group">
          <label>:מספר כרטיס אשראי</label>
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
          <label>:תוקף כרטיס</label>
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
          <label>:CVV</label>
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

        <div className="form-group">
          <label>:תעודת זהות</label>
          <input
            type="text"
            value={idNumber}
            onChange={handleIdNumberChange}
            required
          />
          {errors.idNumber ? (
            <span className="error">{errors.idNumber}</span>
          ) : idNumber.length === 9 && (
            <span className="success">✔</span>
          )}
        </div>

        {/* בחירת מספר תשלומים, מוצג תמיד */}
        <div className="form-group">
          <label>:כמות תשלומים</label>
          <select value={installments} onChange={(e) => setInstallments(e.target.value)}>
            {[...Array(12).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>{n + 1}</option>
            ))}
          </select>
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
