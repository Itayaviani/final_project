const express = require('express');
const router = express.Router();
const Project = require('../models/ProjectModel');
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
      projectDescription, 
      projectDetails, 
      images 
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
    console.error('"עיבוד הרכישה נכשל"', err);
    res.status(500).json({ error: 'נכשל בעדכון הפרויקט' });
  }
});


// נתיב למחיקת פרוייקט
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'הפרויקט לא נמצא' });
    }
    res.status(200).json({ message: 'הפרויקט נמחק בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: 'מחיקת הפרויקט נכשלה' });
  }
});


// נתיב להצגת כל הפרויקטים
router.get('/', async (req, res) => {
    try {
      const projects = await Project.find();
      res.json(projects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.get('/:id', async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'הפרויקט לא נמצא' });
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ error: 'אחזור פרטי הפרויקט נכשל' });
    }
  });
  
module.exports = router;
