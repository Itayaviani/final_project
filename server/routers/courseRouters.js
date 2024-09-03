const express = require('express');
const router = express.Router();
const Course = require('../models/CourseModel');

// מסלול להוספת קורס חדש
router.post('/', async (req, res) => {
  console.log(req.body)
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

module.exports = router;
