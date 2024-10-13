const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controler'); // וודא שהנתיב נכון
const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/me", protect, userController.getMe);

// Route to get the logged-in user's purchases
router.get('/me/purchases', protect, userController.getUserPurchases); 

// Route to get all users (admin only)
router.get("/", protect, userController.getAllUsers); 

// Route to get a user by ID
router.get("/:id", protect, userController.getUserById); 

// Route to delete a user by ID
router.delete("/:id", protect, userController.deleteUser); 

// Route to update a user by ID
router.put("/:id", protect, userController.updateUser); 

// **Route to get all purchases from all users** (Admin Only)
router.get("/purchases/all", protect, userController.getAllUserPurchases); 

module.exports = router;
