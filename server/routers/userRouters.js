const express = require("express");
const router = express.Router();
const usercontroler = require('../controllers/user.controler'); // וודא שהנתיב נכון

const { protect } = require("../middleware/authMiddleware");

router.post("/login", usercontroler.login);
router.post("/register", usercontroler.register);
router.get("/me", protect, usercontroler.getMe);
// router.get('/me/purchases', protect, usercontroler.getUserPurchases); // שינוי ל-usercontroler כדי להתאים
router.get("/", protect, usercontroler.getAllUsers); // נתיב לקבלת כל המשתמשים
router.get("/:id", protect, usercontroler.getUserById); // נתיב לקבלת משתמש לפי ID
router.delete("/:id", protect, usercontroler.deleteUser); // נתיב למחיקת משתמש
router.put("/:id", protect, usercontroler.updateUser); // עדכון המשתמש

module.exports = router;
