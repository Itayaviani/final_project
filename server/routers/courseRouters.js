const express = require('express');
const router = express.Router();
const Course = require('../models/CourseModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const multer = require('multer');
const path = require('path');
const User = require('../models/UserModel'); // וודא שהנתיב נכון בהתאם למבנה התיקיות שלך

// הגדרת אחסון התמונות
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// חשיפת תיקיית 'uploads' כמשאב סטטי
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// נתיב להוספת קורס חדש
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, courseDescription, courseDetails, price, capacity, startDate, startTime } = req.body; // הוספת startTime מהבקשה

    // קבלת נתיב התמונה שהועלתה
    let courseImagePath = req.file ? req.file.path : '';

    // החלפת כל התווים ההפוכים בתווים רגילים כדי לוודא שהתמונה ניתנת לשליפה כראוי
    courseImagePath = courseImagePath.replace(/\\/g, '/');

    // יצירת הקורס החדש
    const newCourse = new Course({
      name,
      courseDescription, // תיאור הקורס הקצר
      courseDetails, // פרטי הקורס המלאים
      price,
      capacity,
      image: courseImagePath, // שמירת נתיב התמונה
      startDate: new Date(startDate), // שמירת תאריך תחילת הקורס
      startTime, // שמירת שעת תחילת הקורס
    });

    // שמירת הקורס במסד הנתונים
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find(); // שלוף את כל השדות ללא הגבלה
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a course by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// נתיב לעדכון קורס
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, courseDescription, courseDetails, price, capacity, startDate, startTime } = req.body; // הוספת startTime מהבקשה

    // מצא את הקורס לפי מזהה
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // עדכון פרטי הקורס
    course.name = name || course.name;
    course.courseDescription = courseDescription || course.courseDescription; // תיאור הקורס הקצר
    course.courseDetails = courseDetails || course.courseDetails; // פרטי הקורס המלאים
    course.price = price || course.price;
    course.capacity = capacity || course.capacity;
    course.startDate = startDate ? new Date(startDate) : course.startDate; // עדכון תאריך ההתחלה
    course.startTime = startTime || course.startTime; // עדכון שעת התחלה

    // עדכון התמונה רק אם הועלתה תמונה חדשה
    if (req.file) {
      course.image = req.file.path;
    }

    // שמירת הקורס המעודכן
    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (err) {
    console.error('Failed to update course:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// נתיב לרכישת קורס
router.post('/purchase', async (req, res) => {
  console.log('Start processing purchase request');  // לוג למעקב
  const { fullName, email, courseId } = req.body;

  console.log('Received purchase data:', { fullName, email, courseId });  // לוג למעקב

  try {
    // ודא שה-courseId הוא ObjectId
    const mongoose = require('mongoose');
    const validCourseId = mongoose.Types.ObjectId.isValid(courseId) ? new mongoose.Types.ObjectId(courseId) : null;

    if (!validCourseId) {
      console.log('Invalid courseId');  // לוג אם ה-courseId לא תקין
      return res.status(400).json({ error: 'Invalid courseId' });
    }

    const course = await Course.findById(validCourseId);
    if (!course) {
      console.log('Course not found');  // לוג אם הקורס לא נמצא
      return res.status(404).json({ error: 'Course not found' });
    }

    console.log('Course found:', course.name);  // לוג אם הקורס נמצא

    // בדיקה אם הקורס הגיע לתפוסה המקסימלית
    if (course.participants >= course.capacity) {
      console.log('Course is full');  // לוג אם הקורס מלא
      return res.status(400).json({ error: 'The course is full. Registration is not possible.' });
    }

    // חפש את המשתמש על פי כתובת האימייל
    const user = await User.findOne({ email: email.trim() });

    console.log("User found:", user ? user.name : "Not found");
    if (!user) {
      console.log('User not found');  // לוג אם המשתמש לא נמצא
      return res.status(404).json({ error: 'User not found' });
    }

    // בדוק אם המערך purchasedCourses קיים, אם לא - אתחל אותו
    user.purchasedCourses = user.purchasedCourses || [];

    // בדוק אם המשתמש כבר רכש את הקורס הזה
    if (user.purchasedCourses.includes(validCourseId)) {
      console.log('User has already purchased this course');
      return res.status(200).json({ message: 'Course already purchased', purchased: true });
    }

    // הוסף את הקורס לרשימת הרכישות של המשתמש
    user.purchasedCourses.push(validCourseId);
    await user.save();

    // עדכון מספר המשתתפים בקורס
    course.participants += 1;
    await course.save();

    // שלח את המייל עם פרטי הקורס
    await sendOrderConfirmationEmail(
      email,
      fullName,
      course.name,
      'course', // מציין שזה קורס
      validCourseId,
      course.startDate,
      course.startTime,
      course.courseDetails
    );
    console.log('Email sent successfully');  // לוג להצלחה בשליחת המייל

    res.status(200).send('הזמנתך התקבלה בהצלחה!');
  } catch (err) {
    console.error('Error occurred during purchase process:', err);  // לוג במקרה של שגיאה
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});




module.exports = router;
