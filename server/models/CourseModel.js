const mongoose = require("mongoose");

// הגדרת סכימת הקורס עם סוגי השדות והדרישות שלהם
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'], // הודעה מותאמת אישית אם השדה חסר
    trim: true, // הסרת רווחים מיותרים בתחילת וסוף המחרוזת
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Course price must be a positive number'], // הבטחה שהמחיר הוא חיובי
  },
  image: {
    type: String, // ניתן לשמור URL של התמונה או להשתמש ב-Buffer לשמירת התמונה עצמה
    trim: true, // הסרת רווחים מיותרים
  },
  createdAt: {
    type: Date,
    default: Date.now, // ברירת מחדל היא התאריך הנוכחי בעת יצירת המסמך
  },
});

// יצירת מודל קורס על בסיס הסכימה
const Course = mongoose.model("Course", courseSchema);

// ייצוא המודל לשימוש במקומות אחרים באפליקציה
module.exports = Course;
