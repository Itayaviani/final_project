const express = require("express");
const router = express.Router();
const userController = require('../controllers/user.controler'); 
const { protect } = require("../middleware/authMiddleware");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.get("/me", protect, userController.getMe);

router.get('/me/purchases', protect, userController.getUserPurchases); 

router.get("/", protect, userController.getAllUsers); 

router.get("/:id", protect, userController.getUserById); 

router.delete("/:id", protect, userController.deleteUser); 

router.put("/:id", protect, userController.updateUser); 

router.get("/purchases/all", protect, userController.getAllUserPurchases); 
router.get('/purchases/statistics', userController.getPurchaseStatistics);

module.exports = router;
