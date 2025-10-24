import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Auth middleware
export const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from cookies or headers
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ Attach user to request
    const user = await User.findById(decoded.id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // attach user to request
    next(); // continue to next middleware or route
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
