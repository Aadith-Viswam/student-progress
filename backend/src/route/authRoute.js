
import express from "express";
import { getUserProfile, login, logout, signup } from "../controller/userController.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


router.get("/check", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "Not logged in" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(401).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
});

router.get("/profile", authMiddleware, getUserProfile);

export default router;
