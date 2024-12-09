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
      return res.status(400).json({ message: "משתמש כבר קיים" });
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
      .json({ message: "המשתמש נרשם בהצלחה" });
  } catch (err) {
    return res.status(404).json({ message: "ההרשמה נכשלה" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({email});
    console.log(email,user);
    if (!user) {
      
      return res.status(404).json({ message: "אימייל לא חוקי!" });
    } 

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if(!isPasswordValid){
        return res.status(401).json({ message: "סיסמה לא חוקית!" });
    }
    const token = jwt.sign({ id: user._id }, "TAL", { expiresIn: '1h' });
    res.status(200).send({token,message:"הכניסה של המשתמש לאתר"})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "שגיאת שרת פנימית" });
  }
});

// נתיב חדש להחזרת כל הרכישות של המשתמש
router.get("/me/purchases", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate('purchasedCourses');
    if (!user) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
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
    console.error("שגיאה באחזור רכישות של משתמשים:", error);
    res.status(500).json({ message: "אחזור רכישות של משתמשים נכשל" });
  }
});



module.exports = router;
