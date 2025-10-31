const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/Otp');
const nodemailer = require('nodemailer');

// Nodemailer transporter config (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send OTP route
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP with 3 min expiry
  await OTP.findOneAndDelete({ email }); // clear previous OTPs for email
  await OTP.create({
    email,
    otp,
    expiresAt: Date.now() + 3 * 60 * 1000
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your VulnScraper OTP Code',
    text: `Your OTP is: ${otp}. It expires in 3 minutes.`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'OTP sent to email.' });
  } catch (error) {
    console.error('Nodemailer send error:', error);
    res.status(500).json({ error: 'Could not send OTP, try again.' });
  }
});

// Verify OTP route
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

  const record = await OTP.findOne({ email, otp });
  if (!record) return res.status(400).json({ error: 'Invalid OTP' });

  if (record.expiresAt < Date.now()) {
    await OTP.deleteOne({ email, otp });
    return res.status(400).json({ error: 'OTP expired' });
  }

  res.json({ success: true, message: 'OTP verified' });
});

// Signup route (only after OTP verified)
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const verifiedOTP = await OTP.findOne({ email });
    if (!verifiedOTP) return res.status(400).json({ error: 'OTP not verified' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    await OTP.deleteOne({ email }); // remove OTP after signup success

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Your existing login route here 

module.exports = router;
