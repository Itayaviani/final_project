const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = "mongodb://127.0.0.1:27017"; 

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("connected to port : " + PORT);
});