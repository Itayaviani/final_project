const Contact = require('../models/ContactModel');

// יצירת פניה חדשה
exports.createContact = async (req, res) => {
  try {
    // יצירת פניה חדשה במסד הנתונים לפי הנתונים שהתקבלו
    const newContact = await Contact.create(req.body);
    // שליחת תגובה ללקוח עם סטטוס 201 (נוצר) ונתוני הפניה החדשה
    res.status(201).json({
      status: 'success',
      data: newContact,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// הצגת כל הפניות לאדמין
exports.getAllContacts = async (req, res) => {
  try {
    // שאילתת מסד הנתונים לשליפת כל הפניות
    const contacts = await Contact.find();
    // שליחת תגובה ללקוח עם סטטוס 200 (הצלחה) ורשימת הפניות
    res.status(200).json({
      status: 'success',// סטטוס ההצלחה
      data: contacts,// רשימת הפניות
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// מחיקת פניה לפי מזהה
exports.deleteContact = async (req, res) => {
  try {
    // חיפוש ומחיקת הפניה לפי המזהה שהתקבל בפרמטרים של הבקשה
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({
        status: 'fail',
        message: 'No contact found with that ID',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};
