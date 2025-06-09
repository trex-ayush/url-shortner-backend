const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/helper");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists, Please Login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken({ _id: user._id });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 3600000,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          // add any other safe fields you want to send
        },
      });
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later.",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        sameSite: "Strict",
        maxAge: 0,
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout",
    });
  }
};
