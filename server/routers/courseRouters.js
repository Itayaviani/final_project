const express = require('express');
const router = express.Router();
const Course = require('../models/CourseModel');

// מסלול להוספת קורס חדש
router.post('/', async (req, res) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// מסלול לקבלת כל הקורסים
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// מסלול לקבלת קורס לפי מזהה
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

// מסלול למחיקת קורס לפי מזהה
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

// מסלול לעדכון קורס לפי מזהה
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    // בדוק אם יש קורס
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // עדכון פרטי הקורס
    course.name = name || course.name;
    course.description = description || course.description;
    course.price = price || course.price;
    course.image = image || course.image; // שמור את התמונה הקיימת אם לא הועלתה חדשה

    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
