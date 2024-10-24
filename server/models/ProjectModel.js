const mongoose = require("mongoose");

// הגדרת סכימת הפרוייקט עם סוגי השדות והדרישות שלהם
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'], // הודעה מותאמת אישית אם השדה חסר
    trim: true, // הסרת רווחים מיותרים בתחילת וסוף המחרוזת
  },
  projectDescription: {
    type: String,
    required: [true, 'Project description is required'], // שדה עבור תיאור הפרוייקט
    trim: true,
  },
  projectDetails: { // שדה עבור פרטי הפרוייקט
    type: String,
    required: [true, 'Full project details are required'], // שדה עבור פרטי הפרוייקט המלאים
    trim: true,
  },
  images: {
    type: [String], // שדה עבור שמירת כתובות URL של 3 תמונות
    validate: [arrayLimit, 'You can only upload three images.'], // הגבלת מספר התמונות ל-3
    trim: true, // הסרת רווחים מיותרים
  },
  createdAt: {
    type: Date,
    default: Date.now, // ברירת מחדל היא התאריך הנוכחי בעת יצירת המסמך
  },
});

// פונקציה מותאמת אישית להבטיח שהמשתמש מעלה רק 3 תמונות
function arrayLimit(val) {
  return val.length <= 3;
}

// יצירת מודל פרוייקט על בסיס הסכימה
const Project = mongoose.model("Project", projectSchema);

// ייצוא המודל לשימוש במקומות אחרים באפליקציה
module.exports = Project;
