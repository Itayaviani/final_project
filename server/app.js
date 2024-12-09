const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const userRoute = require("./routers/userRouters");
const courseRouter = require("./routers/courseRouters");
const workshopRouter = require("./routers/workshopRouters");
const contactRouter = require("./routers/contactRouters");
const projectRouter = require("./routers/projectRouter");
const statusRouter = require('./routers/statusRouter'); 

app.use(cors());
app.use(express.json()); 

app.use("/api/v1/users", userRoute);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/workshops", workshopRouter);
app.use("/api/v1/contacts", contactRouter);
app.use("/api/v1/projects", projectRouter); 
app.use('/api/admin', statusRouter);

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

module.exports = app;
