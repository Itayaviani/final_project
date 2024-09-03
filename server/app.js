const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routers/userRouters");
const courseRouter = require("./routers/courseRouters"); // ייבוא ה-router של הקורסים

const app = express();

// התחברות ל-MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("Could not connect to MongoDB", err));

app.use(cors());
app.use(express.json());

// app routes
app.use("/api/v1/users", userRoute);
app.use("/api/courses", courseRouter); // שימוש בנתיב הקורסים

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
