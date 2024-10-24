const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

// Importing routes
const userRoute = require("./routers/userRouters");
const courseRouter = require("./routers/courseRouters");
const workshopRouter = require("./routers/workshopRouters");
const contactRouter = require("./routers/contactRouters");
const projectRouter = require("./routers/projectRouter"); // ייבוא נתיב הפרויקטים

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/workshops", workshopRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/projects", projectRouter); // הוספת נתיב הפרויקטים

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// Health check route
app.get("/", (req, res) => {
  res.send("Hello World!"); // Basic response to test server
});

// Export app for server setup
module.exports = app;
