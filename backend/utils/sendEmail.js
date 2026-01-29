const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    html: `<h3>Your OTP is: ${otp}</h3>`
  });
};

module.exports = sendOTP;
