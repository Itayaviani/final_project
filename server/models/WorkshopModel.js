const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Workshop name is required'], 
    trim: true, 
  },
  workshopDescription: {
    type: String,
    required: [true, 'Workshop description is required'], 
    trim: true,
  },
  workshopDetails: { 
    type: String,
    required: [true, 'Full workshop details are required'], 
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Workshop price is required'],
    min: [0, 'Workshop price must be a positive number'], 
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
    required: [true, 'Workshop start date is required'], 
  },
  startTime: { 
    type: String, 
    required: [true, 'Workshop start time is required'], 
  },
  participants: {
    type: Number,
    default: 0, 
    min: [0, 'Participants count cannot be negative'], 
  },
  capacity: {
    type: Number,
    required: [true, 'Workshop capacity is required'], 
    min: [1, 'Workshop capacity must be at least 1'], 
  },
});

const Workshop = mongoose.model("Workshop", workshopSchema);

module.exports = Workshop;
