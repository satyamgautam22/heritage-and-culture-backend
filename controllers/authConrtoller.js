import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users.js";
import dotenv from "dotenv";
import sendEmail from "../config/nodemailer.js";

dotenv.config();

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      isVerified: false,
    });

    // Send OTP to email
    await sendEmail(
      email,
      "Welcome to Heritage and Culture",
      `<p>Hi ${name},</p>
       <p>Thank you for registering. Your account has been created successfully.</p>
       <p>Your OTP is: <b>${otp}</b></p>
       <p>Please use this OTP to verify your account.</p>`
    );

    res.status(201).json({ message: "User created. Please verify OTP." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check OTP
    if (otp !== user.otp && otp !== process.env.ADMIN_OTP) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user verified (first time)
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};