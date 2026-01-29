const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,

  passwordHistory: [String], 

  otp: String,
  otpExpires: Date,
  otpLastSent: Date 
});

module.exports = mongoose.model("User", userSchema);
