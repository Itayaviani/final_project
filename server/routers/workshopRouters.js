const express = require('express');
const router = express.Router();
const Workshop = require('../models/WorkshopModel');
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
      image: workshopImagePath,
    });

    await newWorkshop.save();
    res.status(201).json(newWorkshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// נתיב לקבלת כל הסדנאות
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// נתיב לקבלת סדנה לפי ID
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

// נתיב למחיקת סדנה לפי ID
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

    // מצא את הסדנה לפי ID
    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    // עדכון פרטי הסדנה
    workshop.name = name || workshop.name;
    workshop.description = description || workshop.description;
    workshop.price = price || workshop.price;
    workshop.capacity = capacity || workshop.capacity;

    // עדכון התמונה רק אם התווספה תמונה חדשה
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
  console.log('Start processing workshop purchase request');
  const { fullName, email, workshopId } = req.body;

  console.log('Received purchase data:', { fullName, email, workshopId });

  // חפש את שם הסדנה על פי ה-workshopId
  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      console.log('Workshop not found');
      return res.status(404).json({ error: 'Workshop not found' });
    }

    console.log('Workshop found:', workshop.name);

    // בדיקה אם הסדנה הגיעה לתפוסה המקסימלית
    if (workshop.participants >= workshop.capacity) {
      console.log('Workshop is full');
      return res.status(400).json({ error: 'The workshop is full. Registration is not possible.' });
    }

    // חפש את המשתמש על פי כתובת האימייל
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user.name);

    // בדוק אם המשתמש כבר רכש את הסדנה הזו
    if (user.purchasedWorkshops && user.purchasedWorkshops.includes(workshopId)) {
      console.log('User has already purchased this workshop');
      return res.status(200).json({ message: 'Workshop already purchased', purchased: true });
    }

    // הוסף את הסדנה לרשימת הרכישות של המשתמש
    user.purchasedWorkshops = user.purchasedWorkshops || []; // וודא שמתקיים מערך סדנאות שנרכשו
    user.purchasedWorkshops.push(workshopId);
    await user.save();

    // עדכון מספר המשתתפים בסדנה
    workshop.participants += 1;
    await workshop.save();

    // שלח את המייל עם שם הסדנה הנכון
    await sendOrderConfirmationEmail(email, fullName, workshop.name, workshopId);
    console.log('Email sent successfully');

    res.status(200).send('הזמנתך לסדנה התקבלה בהצלחה!');
  } catch (err) {
    console.error('Error occurred during workshop purchase process:', err);
    res.status(500).json({ error: 'Failed to process workshop purchase' });
  }
});

module.exports = router;
