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
  const { email, phone, name, password, idNumber } = req.body;

  // מערך לאיסוף שמות השדות שכבר קיימים
  const existingFields = [];

  // בדיקת קיום משתמש לפי אימייל, טלפון ותעודת זהות
  const existingUserByEmail = await User.findOne({ email });
  const existingUserByPhone = await User.findOne({ phone });
  const existingUserByIdNumber = await User.findOne({ idNumber });

  // הוספת השדה למערך אם הוא כבר קיים
  if (existingUserByEmail) {
    existingFields.push({ field: "כתובת האימייל", gender: "female" });
  }
  if (existingUserByPhone) {
    existingFields.push({ field: "מספר הטלפון", gender: "male" });
  }
  if (existingUserByIdNumber) {
    existingFields.push({ field: "תעודת הזהות", gender: "female" });
  }

  // אם יש שדות שכבר קיימים, בונים את ההודעה ומחזירים שגיאה
  if (existingFields.length > 0) {
    const fieldsList = existingFields.map(item => item.field).join(", ");
    const hasFemaleFields = existingFields.some(item => item.gender === "female");

    // בחירת הניסוח המתאים לפי זכר/נקבה ורבים/יחיד
    const errorMessage =
      existingFields.length === 1
        ? `${fieldsList} כבר ${hasFemaleFields ? "קיימת" : "קיים"} במערכת`
        : `${fieldsList} כבר קיימים במערכת`;

    return res.status(400).json({ message: errorMessage });
  }

  // יצירת משתמש חדש ושמירת תעודת זהות
  const newUser = await User.create({ name, email, phone, password, idNumber });
  createAndSendToken(newUser, 201, res);
});




// התחברות משתמש
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // בדיקה אם האימייל והסיסמה סופקו בבקשה
  if (!email || !password) {
    return res.status(400).json({ message: "יש לספק אימייל וסיסמה" });
  }

  // חיפוש המשתמש לפי אימייל
  const user = await User.findOne({ email }).select("+password");

  // בדיקה אם האימייל לא נמצא
  if (!user) {
    return res.status(404).json({ message: "אימייל זה לא קיים במאגר" });
  }

  // בדיקה אם הסיסמה שגויה
  const isPasswordCorrect = await user.correctPassword(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "סיסמא שגויה, אנא נסה שנית" });
  }

  // אם האימייל והסיסמה תקינים, יוצרים טוקן ושולחים תגובה
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
    .populate({
      path: 'purchasedCourses.course',
      select: 'name price'
    })
    .populate({
      path: 'purchasedWorkshops.workshop',
      select: 'name price'
    });

  if (!user) {
    return next(new AppError("משתמש לא נמצא", 404));
  }

  const purchasedCourses = user.purchasedCourses || [];
  const purchasedWorkshops = user.purchasedWorkshops || [];

  res.status(200).json({
    status: "success",
    purchases: {
      courses: purchasedCourses
        .filter(course => course && course.course)  // סינון ערכי null
        .map((purchase) => ({
          _id: purchase.course._id,
          name: purchase.course.name,
          price: purchase.course.price,
          purchaseDate: purchase.purchaseDate,
        })),
      workshops: purchasedWorkshops
        .filter(workshop => workshop && workshop.workshop)  // סינון ערכי null
        .map((purchase) => ({
          _id: purchase.workshop._id,
          name: purchase.workshop.name,
          price: purchase.workshop.price,
          purchaseDate: purchase.purchaseDate,
        })),
    },
  });
});

// פונקציה לשליפת כל הרכישות מכל המשתמשים
exports.getAllUserPurchases = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .populate({
      path: 'purchasedCourses.course',
      select: 'name price'
    })
    .populate({
      path: 'purchasedWorkshops.workshop',
      select: 'name price'
    });

  const allPurchases = users.map((user) => ({
    userId: user._id,
    name: user.name,
    email: user.email,
    idNumber: user.idNumber, // הוספת תעודת זהות
    courses: (user.purchasedCourses || [])
      .filter(purchase => purchase && purchase.course)
      .map((purchase) => ({
        _id: purchase.course._id,
        name: purchase.course.name,
        price: purchase.course.price,
        purchaseDate: purchase.purchaseDate,
      })),
    workshops: (user.purchasedWorkshops || [])
      .filter(purchase => purchase && purchase.workshop)
      .map((purchase) => ({
        _id: purchase.workshop._id,
        name: purchase.workshop.name,
        price: purchase.workshop.price,
        purchaseDate: purchase.purchaseDate,
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
exports.getPurchaseStatistics = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .populate({
      path: 'purchasedCourses.course',
      select: 'name price'
    })
    .populate({
      path: 'purchasedWorkshops.workshop',
      select: 'name price'
    });

  const allPurchases = users.flatMap(user => [
    ...user.purchasedCourses.map(purchase => ({
      name: purchase.course?.name,
      price: purchase.course?.price || 0,
      type: 'קורס'
    })),
    ...user.purchasedWorkshops.map(purchase => ({
      name: purchase.workshop?.name,
      price: purchase.workshop?.price || 0,
      type: 'סדנה'
    }))
  ]);

  // חישוב הרווח הכולל
  const totalRevenue = allPurchases.reduce((acc, purchase) => acc + (purchase.price || 0), 0);

// פונקציה למציאת כל הפריטים הנרכשים ביותר והפחות נרכשים
const calculateMostAndLeastPurchased = (type) => {
  const filteredPurchases = allPurchases.filter(purchase => purchase.type === type);
  
  // חישוב מספר הרכישות לכל פריט
  const itemCount = filteredPurchases.reduce((count, item) => {
    count[item.name] = (count[item.name] || 0) + 1;
    return count;
  }, {});

  // מציאת הכמות המקסימלית והמינימלית של רכישות
  const maxCount = Math.max(...Object.values(itemCount));
  const minCount = Math.min(...Object.values(itemCount));

  // מציאת כל הפריטים עם הכמות המקסימלית והמינימלית
  const mostPurchasedItems = Object.keys(itemCount)
    .filter(name => itemCount[name] === maxCount)
    .map(name => ({ name, count: itemCount[name] }));

  const leastPurchasedItems = Object.keys(itemCount)
    .filter(name => itemCount[name] === minCount)
    .map(name => ({ name, count: itemCount[name] }));

  return {
    mostPurchased: mostPurchasedItems,
    leastPurchased: leastPurchasedItems
  };
};


  const courseStats = calculateMostAndLeastPurchased('קורס');
  const workshopStats = calculateMostAndLeastPurchased('סדנה');

  res.status(200).json({
    status: "success",
    data: {
      totalRevenue,
      courseStats,
      workshopStats
    }
  });
});