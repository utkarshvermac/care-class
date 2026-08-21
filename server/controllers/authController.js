import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

// @route  POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, collegeName, defaultTarget } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      collegeName,
      defaultTarget: defaultTarget || 75,
    });

    res.status(201).json({
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route  POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      user,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @route  GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

// @route  PUT /api/auth/me
export const updateMe = async (req, res, next) => {
  try {
    const { name, collegeName, defaultTarget, avatarColor } = req.body;

    if (name !== undefined) req.user.name = name;
    if (collegeName !== undefined) req.user.collegeName = collegeName;
    if (defaultTarget !== undefined) req.user.defaultTarget = defaultTarget;
    if (avatarColor !== undefined) req.user.avatarColor = avatarColor;

    await req.user.save();
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};
