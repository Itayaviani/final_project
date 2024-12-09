const express = require("express");
const router = express.Router();
const Course = require("../models/CourseModel");
const { sendOrderConfirmationEmail } = require("../utils/emailService");

const multer = require("multer");

const path = require("path");
const User = require("../models/UserModel"); 

// הגדרת אחסון התמונות
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage: storage });


router.use("/uploads", express.static(path.join(__dirname, "../uploads")));


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      courseDescription,
      courseDetails,
      price,
      capacity,
      startDate,
      startTime,
    } = req.body; 


    let courseImagePath = req.file ? req.file.path : "";


    courseImagePath = courseImagePath.replace(/\\/g, "/");


    const newCourse = new Course({
      name,
      courseDescription, 
      courseDetails, 
      price,
      capacity,
      image: courseImagePath,
      startDate: new Date(startDate),
      startTime, 
    });


    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const courses = await Course.find(); 
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await Course.findByIdAndDelete(id);
    if (!deletedCourse) {
      return res.status(404).json({ error: "הקורס לא נמצא" });
    }
    res.status(200).json({ message: "הקורס נמחק בהצלחה" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      courseDescription,
      courseDetails,
      price,
      capacity,
      startDate,
      startTime,
    } = req.body; 


    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }


    course.name = name || course.name;
    course.courseDescription = courseDescription || course.courseDescription; 
    course.courseDetails = courseDetails || course.courseDetails;
    course.price = price || course.price;
    course.capacity = capacity || course.capacity;
    course.startDate = startDate ? new Date(startDate) : course.startDate; 
    course.startTime = startTime || course.startTime;


    if (req.file) {
      course.image = req.file.path;
    }


    const updatedCourse = await course.save();

    res.json(updatedCourse);
  } catch (err) {
    console.error("עדכון הקורס נכשל:", err);
    res.status(500).json({ error: "עדכון הקורס נכשל" });
  }
});


router.post("/purchase", async (req, res) => {
  console.log("התחל לעבד את בקשת הרכישה"); 
  const { fullName, email, courseId } = req.body;

  console.log("נתוני רכישה שהתקבלו:", { fullName, email, courseId }); 

  try {
    
    const mongoose = require("mongoose");

    const validCourseId = mongoose.Types.ObjectId.isValid(courseId)
      ? new mongoose.Types.ObjectId(courseId)
      : null;

    if (!validCourseId) {
      console.log("מזהה קורס לא חוקי"); 
      return res.status(400).json({ error: "מזהה קורס לא חוקי" });
    }

    const course = await Course.findById(validCourseId);
    if (!course) {
      console.log("הקורס לא נמצא"); 
      return res.status(404).json({ error: "הקורס לא נמצא" });
    }

    console.log("Course found:", course.name); 


    if (course.participants >= course.capacity) {
      console.log("הקורס מלא"); 
      return res
        .status(400)
        .json({ error: "הקורס מלא. לא ניתן להרשם." });
    }


    const user = await User.findOne({ email: email.trim() });

    console.log("משתמש נמצא:", user ? user.name : "לא נמצא");
    if (!user) {
      console.log("המשתמש לא נמצא");
      return res.status(404).json({ error: "המשתמש לא נמצא" });
    }

    user.purchasedCourses = user.purchasedCourses || [];


    if (
      user.purchasedCourses.some(
        (purchase) =>
          purchase.course &&
          purchase.course.toString() === validCourseId.toString()
      )
    ) {
      console.log("המשתמש כבר רכש קורס זה");
      return res
        .status(200)
        .json({ message: "הקורס כבר נרכש", purchased: true });
    }


    user.purchasedCourses.push({
      course: validCourseId,
      purchaseDate: new Date(),
    });
    await user.save();


    course.participants += 1;
    await course.save();


    await sendOrderConfirmationEmail(
      email,
      fullName,
      course.name,
      "course", 
      validCourseId,
      course.startDate,
      course.startTime,
      course.courseDetails
    );
    console.log("האימייל נשלח בהצלחה"); 

    res.status(200).send("הזמנתך התקבלה בהצלחה!");
  } catch (err) {
    console.error("אירעה שגיאה במהלך תהליך הרכישה:", err);
    res.status(500).json({ error: "עיבוד הרכישה נכשל" });
  }
});

module.exports = router;
