const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const AppError = require('../utils/appError');
// יבוא פונקציה promisify מהמודול הבנוי של Node.js, שהיא פונקציה שממירה פונקציות מבוססות callback לפונקציות מבוססות Promise
const { promisify } = require('util');

// פונקציה שנועדה להגן על מסלול (route) ולוודא שלמשתמש יש גישה על פי JWT
exports.protect = async (req, res, next) => {
  let token;

  // בדיקה אם יש טוקן בהדר הראשי של הבקשה
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('אתה לא מחובר! אנא היכנס כדי לקבל גישה.', 401));
  }

  // מאמתים את הטוקן באמצעות JWT ושולפים את המידע שבו (למשל, ה-ID של המשתמש)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('המשתמש השייך לטוקן זה אינו קיים יותר.', 401));
  }

  req.user = currentUser;
  next();
};
