const express = require('express');
const contactController = require('../controllers/contact.controller');
const router = express.Router();

router.post('/', contactController.createContact); // לטפל בבקשת POST לפנייה חדשה
router.get('/', contactController.getAllContacts); // לטפל בבקשת GET להצגת כל הפניות
router.delete('/:id', contactController.deleteContact); // לטפל בבקשת DELETE למחיקת פנייה לפי id

module.exports = router;
