const PurchaseModel = require('../models/PurchaseModel');

exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await PurchaseModel.find(); // חיפוש כל הרכישות ממסד הנתונים
    res.status(200).json({
      status: 'success',
      data: purchases,
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: 'שגיאה בטעינת הרכישות',
      error: error.message,
    });
  }
};
