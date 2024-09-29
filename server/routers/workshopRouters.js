const express = require('express');
const router = express.Router();
const Workshop = require('../models/WorkshopModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
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

// נתיב להוספת סדנה חדשה
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, capacity } = req.body;

    // קבלת נתיב התמונה שהועלתה
    let workshopImagePath = req.file ? req.file.path : '';

    // החלפת כל התווים ההפוכים בתווים רגילים כדי לוודא שהתמונה ניתנת לשליפה כראוי
    workshopImagePath = workshopImagePath.replace(/\\/g, '/');

    const newWorkshop = new Workshop({
      name,
      description,
      price,
      capacity,
      image: workshopImagePath, // שמירת הנתיב המעודכן
    });

    await newWorkshop.save();
    res.status(201).json(newWorkshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find(); // שלוף את כל השדות ללא הגבלה
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to get a workshop by ID
router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route to delete a workshop by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkshop = await Workshop.findByIdAndDelete(id);
    if (!deletedWorkshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }
    res.status(200).json({ message: 'Workshop deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// נתיב לעדכון סדנה
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, capacity } = req.body;

    // Find the workshop by ID
    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    // Update workshop details
    workshop.name = name || workshop.name;
    workshop.description = description || workshop.description;
    workshop.price = price || workshop.price;
    workshop.capacity = capacity || workshop.capacity;

    // Update the image only if a new one is uploaded
    if (req.file) {
      workshop.image = req.file.path.replace(/\\/g, '/');
    }

    const updatedWorkshop = await workshop.save();

    res.json(updatedWorkshop);
  } catch (err) {
    console.error('Failed to update workshop:', err);
    res.status(500).json({ error: 'Failed to update workshop' });
  }
});

// נתיב לרכישת סדנה
router.post('/purchase', async (req, res) => {
  console.log('Start processing workshop purchase request');  // לוג למעקב
  const { fullName, email, workshopId } = req.body;

  console.log('Received purchase data:', { fullName, email, workshopId });  // לוג למעקב

  // חפש את שם הסדנה על פי ה-workshopId
  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      console.log('Workshop not found');  // לוג אם הסדנה לא נמצאה
      return res.status(404).json({ error: 'Workshop not found' });
    }

    console.log('Workshop found:', workshop.name);  // לוג אם הסדנה נמצאה

    // בדיקה אם הסדנה הגיעה לתפוסה המקסימלית
    if (workshop.participants >= workshop.capacity) {
      console.log('Workshop is full');  // לוג אם הסדנה מלאה
      return res.status(400).json({ error: 'The workshop is full. Registration is not possible.' });
    }

    // עדכון מספר המשתתפים בסדנה
    workshop.participants += 1;
    await workshop.save();

    // שלח את המייל עם שם הסדנה הנכון
    await sendOrderConfirmationEmail(email, fullName, workshop.name, workshopId);
    console.log('Email sent successfully');  // לוג להצלחה בשליחת המייל

    res.status(200).send('הזמנתך לסדנה התקבלה בהצלחה!');
  } catch (err) {
    console.error('Error occurred during workshop purchase process:', err);  // לוג במקרה של שגיאה
    res.status(500).json({ error: 'Failed to process workshop purchase' });
  }
});

module.exports = router;
