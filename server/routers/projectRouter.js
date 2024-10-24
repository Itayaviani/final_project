const express = require('express');
const router = express.Router();
const Project = require('../models/ProjectModel'); // ודא שהנתיב נכון בהתאם למבנה התיקיות שלך
const multer = require('multer');
const path = require('path');

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

// נתיב להוספת פרוייקט חדש
router.post('/', upload.array('images', 3), async (req, res) => {
  try {
    const { name, projectDescription, projectDetails } = req.body;

    // קבלת נתיבי התמונות שהועלו
    const images = req.files ? req.files.map(file => file.path.replace(/\\/g, '/')) : [];

    // יצירת הפרוייקט החדש
    const newProject = new Project({
      name,
      projectDescription, // תיאור הפרוייקט
      projectDetails, // פרטי הפרוייקט
      images // שמירת נתיבי התמונות
    });

    // שמירת הפרוייקט במסד הנתונים
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// נתיב לעדכון פרויקט
router.put('/:id', upload.array('images', 3), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, projectDescription, projectDetails } = req.body;

    // מצא את הפרויקט לפי מזהה
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // עדכון פרטי הפרויקט
    project.name = name || project.name;
    project.projectDescription = projectDescription || project.projectDescription;
    project.projectDetails = projectDetails || project.projectDetails;

    // עדכון התמונות רק אם הועלו תמונות חדשות
    if (req.files && req.files.length > 0) {
      project.images = req.files.map(file => file.path.replace(/\\/g, '/')); // עדכון נתיבי התמונות החדשות
    }

    // שמירת הפרויקט המעודכן
    const updatedProject = await project.save();

    res.json(updatedProject);
  } catch (err) {
    console.error('Failed to update project:', err);
    res.status(500).json({ error: 'Failed to update project' });
  }
});


// נתיב למחיקת פרוייקט
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});


// נתיב להצגת כל הפרויקטים
router.get('/', async (req, res) => {
    try {
      const projects = await Project.find(); // שלוף את כל השדות
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch project details' });
    }
  });
  
module.exports = router;
