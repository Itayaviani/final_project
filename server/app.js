const cors = require("cors");
const userRoute = require("./routers/userRouters")
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());

//app routes
app.use("/api/v1/users",userRoute)

app.get("/", (req, res) => {
    res.send("Hello World!");
  });

module.exports = app;

