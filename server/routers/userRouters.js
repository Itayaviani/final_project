const express = require("express");
const router = express.Router();
const userControler = require("../controllers/user.controler");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", userControler.login);
router.post("/register", userControler.register);
router.get("/me", protect, userControler.getMe);
router.get("/", protect, userControler.getAllUsers); // נתיב לקבלת כל המשתמשים
router.get("/:id", protect, userControler.getUserById); // נתיב לקבלת משתמש לפי ID
router.delete("/:id", protect, userControler.deleteUser); // נתיב למחיקת משתמש
router.put("/:id", protect, userControler.updateUser); // עדכון המשתמש

module.exports = router;
