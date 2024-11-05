const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  idNumber: { type: String, required: true }, // הוספת שדה תעודת זהות
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  purchasedCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    purchaseDate: { type: Date, default: Date.now }
  }],
  purchasedWorkshops: [{
    workshop: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
    purchaseDate: { type: Date, default: Date.now }
  }]
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
