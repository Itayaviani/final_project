const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('אתה לא מחובר! אנא היכנס כדי לקבל גישה.', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('המשתמש השייך לטוקן זה אינו קיים יותר.', 401));
  }

  req.user = currentUser;
  next();
};
