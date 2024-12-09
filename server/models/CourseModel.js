const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'], 
    trim: true,
  },
  courseDescription: {
    type: String,
    required: [true, 'Course description is required'], 
    trim: true,
  },
  courseDetails: { 
    type: String,
    required: [true, 'Full course details are required'], 
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Course price must be a positive number'], 
  },
  image: {
    type: String, 
    trim: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  startDate: {
    type: Date, 
    required: [true, 'Course start date is required'], 
  },
  startTime: { 
    type: String, 
    required: [true, 'Course start time is required'], 
  },
  participants: {
    type: Number,
    default: 0, 
    min: [0, 'Participants count cannot be negative'], 
  },
  capacity: {
    type: Number,
    required: [true, 'Course capacity is required'], 
    min: [1, 'Course capacity must be at least 1'], 
  },
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
