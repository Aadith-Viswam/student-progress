import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import { getStudentDetailsByUser, submitAssignment } from "../controller/studentController.js";

const router = express.Router();

// POST /assignments/submit/:assignmentId
router.post("/assignments/submit/:assignmentId", authMiddleware, upload.single("file"), submitAssignment);
router.get("/:id", getStudentDetailsByUser);
export default router;
