const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};


// רישום משתמש חדש
exports.register = catchAsync(async (req, res, next) => {
  const { email, phone, name, password } = req.body;

  // בדיקה אם יש משתמש עם אותו מייל
  const existingUserByEmail = await User.findOne({ email: email });

  // בדיקה אם יש משתמש עם אותו מספר טלפון
  const existingUserByPhone = await User.findOne({ phone: phone });

  // אם נמצא משתמש עם אותו מייל וגם אותו מספר טלפון
  if (existingUserByEmail && existingUserByPhone) {
    return res.status(400).json({
      message: 'מייל ומספר טלפון אלה כבר קיימים במערכת',
    });
  }

  // אם נמצא משתמש עם אותו מייל בלבד
  if (existingUserByEmail) {
    return res.status(400).json({
      message: 'המייל הזה כבר קיים במערכת',
    });
  }

  // אם נמצא משתמש עם אותו מספר טלפון בלבד
  if (existingUserByPhone) {
    return res.status(400).json({
      message: 'מספר הטלפון הזה כבר קיים במערכת',
    });
  }

  // אם לא נמצא משתמש עם אותו מייל או מספר טלפון, צור משתמש חדש
  const newUser = await User.create({ name, email, phone, password });
  
  // יצירת טוקן ושליחתו בתגובה
  createAndSendToken(newUser, 201, res);
});



// התחברות משתמש
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createAndSendToken(user, 200, res);
});

// קבלת פרטי המשתמש המחובר
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  user.password = undefined; // מחיקת הסיסמא מהתגובה
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// קבלת כל המשתמשים
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  
  res.status(200).json({
    status: 'success',
    data: {
      users
    }
  });
});

// קבלת משתמש לפי ID
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// מחיקת משתמש
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// עדכון משתמש
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
