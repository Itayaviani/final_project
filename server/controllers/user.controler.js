const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");

// פונקציה ליצירת טוקן
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// פונקציה ליצירת טוקן ושליחתו עם תשובה
const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
};

// רישום משתמש חדש
exports.register = catchAsync(async (req, res, next) => {
  const { email, phone, name, password } = req.body;

  const existingUserByEmail = await User.findOne({ email });
  const existingUserByPhone = await User.findOne({ phone });

  if (existingUserByEmail && existingUserByPhone) {
    return res.status(400).json({
      message: "מייל ומספר טלפון אלה כבר קיימים במערכת",
    });
  }
  if (existingUserByEmail) {
    return res.status(400).json({ message: "המייל הזה כבר קיים במערכת" });
  }
  if (existingUserByPhone) {
    return res.status(400).json({ message: "מספר הטלפון הזה כבר קיים במערכת" });
  }

  const newUser = await User.create({ name, email, phone, password });
  createAndSendToken(newUser, 201, res);
});

// התחברות משתמש
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createAndSendToken(user, 200, res);
});

// קבלת פרטי המשתמש המחובר
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("No user found with this ID", 404));
  }

  user.password = undefined; // מחיקת הסיסמא מהתגובה
  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// פונקציה לשליפת הרכישות של המשתמש המחובר
exports.getUserPurchases = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate("purchasedCourses")
    .populate("purchasedWorkshops");

  if (!user) {
    return next(new AppError("משתמש לא נמצא", 404));
  }

  res.status(200).json({
    status: "success",
    purchases: {
      courses: user.purchasedCourses.map((course) => ({
        _id: course._id,
        name: course.name,
        price: course.price,
        createdAt: course.createdAt,
      })),
      workshops: user.purchasedWorkshops.map((workshop) => ({
        _id: workshop._id,
        name: workshop.name,
        price: workshop.price,
        createdAt: workshop.createdAt,
      })),
    },
  });
});

// פונקציה לשליפת כל הרכישות מכל המשתמשים
exports.getAllUserPurchases = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .populate("purchasedCourses")
    .populate("purchasedWorkshops");

  const allPurchases = users.map((user) => ({
    userId: user._id,
    name: user.name,
    email: user.email,
    courses: user.purchasedCourses.map((course) => ({
      _id: course._id,
      name: course.name,
      price: course.price,
      createdAt: course.createdAt,
    })),
    workshops: user.purchasedWorkshops.map((workshop) => ({
      _id: workshop._id,
      name: workshop.name,
      price: workshop.price,
      createdAt: workshop.createdAt,
    })),
  }));

  res.status(200).json({
    status: "success",
    data: { purchases: allPurchases },
  });
});

// קבלת כל המשתמשים
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    data: { users },
  });
});

// קבלת משתמש לפי ID
exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No user found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

// מחיקת משתמש
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("No user found with this ID", 404));
  }

  res.status(204).json({ status: "success", data: null });
});

// עדכון משתמש
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("No user found with this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});
