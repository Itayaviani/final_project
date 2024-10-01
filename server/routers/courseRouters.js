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
    const { name, description, price, capacity } = req.body;

    // קבלת נתיב התמונה שהועלתה
    let courseImagePath = req.file ? req.file.path : '';

    // החלפת כל התווים ההפוכים בתווים רגילים כדי לוודא שהתמונה ניתנת לשליפה כראוי
    courseImagePath = courseImagePath.replace(/\\/g, '/');

    const newCourse = new Course({
      name,
      description,
      price,
      capacity,
      image: courseImagePath, // שמירת הנתיב המעודכן
    });

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
    const { name, description, price, capacity } = req.body;

    // Find the course by ID
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update course details
    course.name = name || course.name;
    course.description = description || course.description;
    course.price = price || course.price;
    course.capacity = capacity || course.capacity;

    // Update the image only if a new one is uploaded
    if (req.file) {
      course.image = req.file.path;
    }

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

  // חפש את שם הקורס על פי ה-courseId
  try {
    const course = await Course.findById(courseId);
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

    console.log("line 145 " , user)
    if (!user) {
      console.log('User not found');  // לוג אם המשתמש לא נמצא
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user.name);  // לוג אם המשתמש נמצא

    // בדוק אם המשתמש כבר רכש את הקורס הזה
    if (user.purchasedCourses.includes(courseId)) {
      console.log('User has already purchased this course');
      return res.status(200).json({ message: 'Course already purchased', purchased: true });
    }
    

    // הוסף את הקורס לרשימת הרכישות של המשתמש
    user.purchasedCourses.push(courseId);
    await user.save();

    // עדכון מספר המשתתפים בקורס
    course.participants += 1;
    await course.save();

    // שלח את המייל עם שם הקורס הנכון
    await sendOrderConfirmationEmail(email, fullName, course.name, courseId);
    console.log('Email sent successfully');  // לוג להצלחה בשליחת המייל

    res.status(200).send('הזמנתך התקבלה בהצלחה!');
  } catch (err) {
    console.error('Error occurred during purchase process:', err);  // לוג במקרה של שגיאה
    res.status(500).json({ error: 'Failed to process purchase' });
  }
});


module.exports = router;
