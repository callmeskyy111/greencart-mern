import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

// Register User
export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing details! 🔴" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists! 🔴" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    //token creation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS to access the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in ms.
    });
    return res.json({
      success: true,
      message: "User Successfully Registered ✅",
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Login User
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.json({
        success: false,
        message: "Both EMAIL & PASSWORD are required! 🔴",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Invalid EMAIL or PASSWORD! 🔴",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password! 🔴",
      });
    }
    //token generation
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevent JS to access the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time in ms.
    });
    return res.json({
      success: true,
      message: "User Successfully Logged In ✅",
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}

// Check AUTH.
export async function isAuth(req, res) {
  try {
    const userId = req.userId; // ✅ Get from req.userId

    const user = await User.findById(userId).select("-password");
    return res.json({ success: true, user });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}


// Logout User
export async function logoutUser(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out!" });
  } catch (err) {
    console.log("🔴 COMPLETE ERROR: ", err);
    res.json({ success: false, message: err.message });
  }
}
