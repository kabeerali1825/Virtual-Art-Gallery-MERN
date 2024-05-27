const express = require('express');
const { logInUser, signUpUser, forgetPassword } = require("../controller/userController");
const multer = require('multer');
const User = require('../models/userSchema');

const router = express.Router();

router.post('/login', logInUser);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/Users/jamsh/Desktop/FYP/FYP/frontend/src/uploads/ProfileImage/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/signup', upload.single('image'), signUpUser);
router.post('/forgetPassword', forgetPassword);

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.verifyOtp(email, otp);
    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
