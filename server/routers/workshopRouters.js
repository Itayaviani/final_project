const express = require('express');
const router = express.Router();
const Workshop = require('../models/WorkshopModel');
const { sendOrderConfirmationEmail } = require('../utils/emailService');

// Route to add a new workshop
router.post('/', async (req, res) => {
  try {
    const newWorkshop = new Workshop(req.body);
    await newWorkshop.save();
    res.status(201).json(newWorkshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Route to get all workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find({}, 'name price description'); // Fetch only required fields
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

// Route to update a workshop by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    // Find the workshop by ID
    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return res.status(404).json({ error: 'Workshop not found' });
    }

    // Update workshop details
    workshop.name = name || workshop.name;
    workshop.description = description || workshop.description;
    workshop.price = price || workshop.price;
    workshop.image = image || workshop.image; // Retain existing image if not updated

    const updatedWorkshop = await workshop.save();

    res.json(updatedWorkshop);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/purchase', async (req, res) => {
  console.log('התחלת עיבוד בקשת רכישת סדנה');
  const { fullName, email, workshopId } = req.body; // וודא שזה workshopId ולא courseId

  try {
    const workshop = await Workshop.findById(workshopId); // משתמש במזהה של סדנה
    if (!workshop) {
      console.log('סדנה לא נמצאה');
      return res.status(404).json({ error: 'סדנה לא נמצאה' });
    }

    await sendOrderConfirmationEmail(email, fullName, workshop.name, workshopId);
    console.log('רכישת הסדנה הצליחה והמייל נשלח');

    res.status(200).send('הרכישה שלך התקבלה בהצלחה!');
  } catch (err) {
    console.error('שגיאה במהלך עיבוד רכישת הסדנה:', err);
    res.status(500).json({ error: 'כשל בעיבוד הרכישה' });
  }
});


module.exports = router;
