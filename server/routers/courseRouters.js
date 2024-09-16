const express = require('express');
const router = express.Router();
const Course = require('../models/CourseModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Route to add a new course
router.post('/', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({}, 'name price description'); // Fetch only required fields
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

// Route to update a course by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    // Find the course by ID
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Update course details
    course.name = name || course.name;
    course.description = description || course.description;
    course.price = price || course.price;
    course.image = image || course.image; // Retain existing image if not updated

    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
