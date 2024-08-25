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

module.exports = router;
