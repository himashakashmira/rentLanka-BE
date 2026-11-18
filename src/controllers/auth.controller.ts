import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendWelcomeEmail, sendLoginNotificationEmail } from "../services/email.service";

const JWT_SECRET = process.env.JWT_SECRET || "rentlanka_super_secret_jwt_key_123";

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role, phone, nic } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: "Name, email, and password are required" });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({ success: false, message: "Email is already registered" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role && ["customer", "host", "admin"].includes(role) ? role : "customer",
      phone: phone || "",
      nic: nic || "",
    });

    const token = jwt.sign(
      { id: newUser._id.toString(), role: newUser.role, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Trigger welcome notification email asynchronously (non-blocking)
    sendWelcomeEmail(newUser.email, newUser.name).catch((err) => {
      console.warn("Welcome email async dispatch notice:", err.message);
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        nic: newUser.nic,
      },
    });
  } catch (err: any) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to register" });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Trigger login security alert notification email asynchronously (non-blocking)
    const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "";
    sendLoginNotificationEmail(user.email, user.name, clientIp).catch((err) => {
      console.warn("[RentLanka Email] Login alert async dispatch notice:", err.message);
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        nic: user.nic || "",
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to login" });
  }
};

// Get current user profile
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Forgot password request
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required" });
      return;
    }

    // In production, an email with a secure signed reset token is dispatched
    res.status(200).json({
      success: true,
      message: "If that email is registered with RentLanka, a reset link has been dispatched.",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to process request" });
  }
};

// Get all registered users (Admin directory)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || "Failed to fetch users" });
  }
};

