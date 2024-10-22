const mongoose = require("mongoose");

// הגדרת סכימת הסדנה עם סוגי השדות והדרישות שלהם
const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workshop name is required'], // הודעה מותאמת אישית אם השדה חסר
    trim: true, // הסרת רווחים מיותרים בתחילת וסוף המחרוזת
  },
  workshopDescription: {
    type: String,
    required: [true, 'Workshop description is required'], // שדה עבור תיאור הסדנה
    trim: true,
  },
  workshopDetails: { 
    type: String,
    required: [true, 'Full workshop details are required'], // שדה עבור פרטי הסדנה המלאים
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Workshop price is required'],
    min: [0, 'Workshop price must be a positive number'], // הבטחה שהמחיר הוא חיובי
  },
  image: {
    type: String, // ניתן לשמור URL של התמונה או להשתמש ב-Buffer לשמירת התמונה עצמה
    trim: true, // הסרת רווחים מיותרים
  },
  createdAt: {
    type: Date,
    default: Date.now, // ברירת מחדל היא התאריך הנוכחי בעת יצירת המסמך
  },
  startDate: {
    type: Date, // תאריך תחילת הסדנה
    required: [true, 'Workshop start date is required'], // הודעה מותאמת אישית אם התאריך חסר
  },
  startTime: { 
    type: String, // ניתן לשמור את השעה כ-String (למשל, בפורמט 'HH:mm')
    required: [true, 'Workshop start time is required'], // הודעה מותאמת אישית אם השעה חסרה
  },
  participants: {
    type: Number,
    default: 0, // ברירת מחדל היא 0 משתתפים בתחילת הסדנה
    min: [0, 'Participants count cannot be negative'], // הבטחה שהמספר לא שלילי
  },
  capacity: {
    type: Number,
    required: [true, 'Workshop capacity is required'], // יש להגדיר קיבולת עבור כל סדנה
    min: [1, 'Workshop capacity must be at least 1'], // קיבולת מינימלית של 1 משתתף
  },
});

// יצירת מודל סדנה על בסיס הסכימה
const Workshop = mongoose.model("Workshop", workshopSchema);

// ייצוא המודל לשימוש במקומות אחרים באפליקציה
module.exports = Workshop;
