const express = require('express');
const router = express.Router();
const Workshop = require('../models/WorkshopModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const multer = require('multer');
const path = require('path');
const User = require('../models/UserModel'); 


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


router.use('/uploads', express.static(path.join(__dirname, '../uploads')));


router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, workshopDescription, workshopDetails, price, capacity, startDate, startTime } = req.body; 


    let workshopImagePath = req.file ? req.file.path : '';


    workshopImagePath = workshopImagePath.replace(/\\/g, '/');


    const newWorkshop = new Workshop({
      name,
      workshopDescription,
      workshopDetails,
      price,
      capacity,
      startDate: new Date(startDate),
      startTime,
      image: workshopImagePath,
    });


    await newWorkshop.save();
    res.status(201).json(newWorkshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ error: 'הסדנה לא נמצאה' });
    }
    res.json(workshop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedWorkshop = await Workshop.findByIdAndDelete(id);
    if (!deletedWorkshop) {
      return res.status(404).json({ error: 'הסדנה לא נמצאה' });
    }
    res.status(200).json({ message: 'הסדנה נמחקה בהצלחה' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, workshopDescription, workshopDetails, price, capacity, startDate, startTime } = req.body;


    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return res.status(404).json({ error: 'הסדנה לא נמצאה' });
    }

    console.log('שעת תחילת הסדנה לפני עדכון:', workshop.startTime);

    workshop.name = name || workshop.name;
    workshop.workshopDescription = workshopDescription || workshop.workshopDescription;
    workshop.workshopDetails = workshopDetails || workshop.workshopDetails;
    workshop.price = price || workshop.price;
    workshop.capacity = capacity || workshop.capacity;
    workshop.startDate = startDate ? new Date(startDate) : workshop.startDate;
    workshop.startTime = startTime || workshop.startTime;


    if (req.file) {
      workshop.image = req.file.path.replace(/\\/g, '/');
    }

    console.log('שעת תחילת הסדנה לאחר העדכון:', workshop.startTime);

    const updatedWorkshop = await workshop.save();
    console.log('סדנה מעודכנת:', updatedWorkshop);

    res.json(updatedWorkshop);
  } catch (err) {
    console.error('עדכון הסדנה נכשל:', err);
    res.status(500).json({ error: 'עדכון הסדנה נכשל' });
  }
});



router.post('/purchase', async (req, res) => {
  console.log('התחל לעבד את הבקשה לרכישת סדנה');
  const { fullName, email, workshopId } = req.body;

  console.log('נתוני רכישה שהתקבלו:', { fullName, email, workshopId });

  try {
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      console.log('הסדנה לא נמצאה');
      return res.status(404).json({ error: 'הסדנה לא נמצאה' });
    }

    console.log('הסדנה נמצאה:', workshop.name);


    if (workshop.participants >= workshop.capacity) {
      console.log('הסדנה מלאה');
      return res.status(400).json({ error: 'הסדנה מלאה. לא ניתן להרשם.' });
    }


    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      console.log('המשתמש לא נמצא');
      return res.status(404).json({ error: 'המשתמש לא נמצא' });
    }

    console.log('משתמש נמצא:', user.name);


    if (user.purchasedWorkshops && user.purchasedWorkshops.some(purchase => purchase.workshop.equals(workshopId))) {
      console.log('המשתמש כבר רכש את הסדנה הזו');
      return res.status(200).json({ message: 'הסדנה כבר נרכשה', purchased: true });
    }


    user.purchasedWorkshops = user.purchasedWorkshops || [];
    user.purchasedWorkshops.push({
      workshop: workshopId,
      purchaseDate: new Date() 
    });
    await user.save();


    workshop.participants += 1;
    await workshop.save();


    await sendOrderConfirmationEmail(
      email,
      fullName,
      workshop.name,
      'workshop', 
      workshopId,
      workshop.startDate,
      workshop.startTime,
      workshop.workshopDetails
    );
    console.log('האימייל נשלח בהצלחה');

    res.status(200).send('הזמנתך לסדנה התקבלה בהצלחה!');
  } catch (err) {
    console.error('אירעה שגיאה במהלך תהליך רכישת הסדנה:', err);
    res.status(500).json({ error: 'עיבוד רכישת הסדנה נכשל' });
  }
});

module.exports = router;
