const mongoose = require("mongoose");


const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'], 
    trim: true, 
  },
  projectDescription: {
    type: String,
    required: [true, 'Project description is required'], 
    trim: true,
  },
  projectDetails: { 
    type: String,
    required: [true, 'Full project details are required'], 
    trim: true,
  },
  images: {
    type: [String], 
    validate: [arrayLimit, 'You can only upload three images.'], 
    trim: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});


function arrayLimit(val) {
  return val.length <= 3;
}


const Project = mongoose.model("Project", projectSchema);


module.exports = Project;
