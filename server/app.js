const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routers/userRouters");
const courseRouter = require("./routers/courseRouters"); // ייבוא ה-router של הקורסים
const workshopRouter = require("./routers/workshopRouters")

const app = express();

app.use(cors());
app.use(express.json());

// app routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/workshops",workshopRouter)

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
