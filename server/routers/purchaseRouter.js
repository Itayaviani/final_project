const express = require('express');
const purchaseController = require('../controllers/purchase.controller');

const router = express.Router();

// נתיב לקבלת כל הרכישות
router.get('/', purchaseController.getAllPurchases);

module.exports = router;
