const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendOTP = require("../utils/sendEmail");

const router = express.Router();

const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    if (!passwordRegex.test(password))
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include letters, numbers, and a special character",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      passwordHistory: [hashedPassword], 
    });

    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts += 1;
      await user.save();
      return res.status(400).json({ message: "Wrong password" });
    }

    user.failedLoginAttempts = 0;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otpLastSent && Date.now() - user.otpLastSent < 30000) {
      return res.status(429).json({
        message: "Please wait 30 seconds before resending OTP"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.otpLastSent = Date.now();

    await user.save();
    await sendOTP(email, otp);

    res.json({ message: "OTP resent successfully" });

  } catch (err) {
    res.status(500).json({ message: "Failed to resend OTP" });
  }
});


router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, fullName: user.fullName });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp);
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!passwordRegex.test(newPassword))
      return res.status(400).json({
        message:
          "Password must include letters, numbers, and a special character",
      });

    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    for (const oldHash of user.passwordHistory) {
      const reused = await bcrypt.compare(newPassword, oldHash);
      if (reused)
        return res
          .status(400)
          .json({ message: "You cannot reuse an old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordHistory.push(hashedPassword);
    user.passwordHistory = user.passwordHistory.slice(-5); // keep last 5
    user.otp = null;
    user.otpExpires = null;

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
