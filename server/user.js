const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("./models/UserModel");
const jwt = require("jsonwebtoken")
const secrets = process.env.secret

router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "user already exist" });
    }
    const encryptPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name: name,
      phone: phone,
      email: email,
      password: encryptPassword,
    });
   
    await newUser.save();

    return res
      .status(200)
      .json({ message: "user has successfully registered" });
  } catch (err) {
    return res.status(404).json({ message: "registered failed" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    console.log(email,user);
    if (!user) {
      
      return res.status(404).json({ message: "invalid email!" });
    } 

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if(!isPasswordValid){
        return res.status(401).json({ message: "invalid password!" });
    }
    const token = jwt.sign({ id: user._id }, "TAL", { expiresIn: '1h' });
    res.status(200).send({token,message:"the user login to the website"})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

// נתיב חדש להחזרת כל הרכישות של המשתמש
router.get("/me/purchases", async (req, res) => {
  try {
    const { userId } = req.params;

    // חפש את המשתמש על פי ה-userId
    const user = await User.findById(userId).populate('purchasedCourses');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // שלוף את כל הקורסים שהמשתמש רכש
    const purchasedCourses = await Course.find({ _id: { $in: user.purchasedCourses } });

    // שלוף את כל הסדנאות שהמשתמש רכש
    const purchasedWorkshops = await Workshop.find({ _id: { $in: user.purchasedWorkshops || [] } });

    res.status(200).json({
      purchasedCourses,
      purchasedWorkshops,
    });
  } catch (error) {
    console.error("Error fetching user purchases:", error);
    res.status(500).json({ message: "Failed to fetch user purchases" });
  }
});



module.exports = router;
