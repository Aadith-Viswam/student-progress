import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { 
  createClass, 
  createAssignment, 
  submitMarks, 
  viewStudentsByClass, 
  viewSubmissionsByAssignment,
  getClasses,
  getClassById,
  getAssignmentsByClass,
  getSubmissionsByAssignment
} from "../controller/teacherController.js"; // adjust path if different

const router = express.Router();

/**
 * =========================
 * CLASS ROUTES
 * =========================
 */

// Create a new class (teacher only)
router.post("/classes", authMiddleware, createClass);
router.get("/classes", authMiddleware, getClasses);

/**
 * =========================
 * ASSIGNMENT ROUTES
 * =========================
 */

// Create a new assignment for a class (teacher only)
// classId passed as URL param
router.post("/assignments/:classId", authMiddleware, createAssignment);

/**
 * =========================
 * MARKS ROUTES
 * =========================
 */

// Submit marks for an assignment (teacher only)
// assignmentId passed as URL param
router.post("/marks/:assignmentId", authMiddleware, submitMarks);

/**
 * =========================
 * STUDENT ROUTES
 * =========================
 */

// View all students in a class
// classId passed as URL param
router.get("/students/class/:classId", authMiddleware, viewStudentsByClass);
router.get("/assignments/:assignmentId/submissions", authMiddleware, viewSubmissionsByAssignment);
router.get("/class/:id",authMiddleware, getClassById);
router.get("/assignment/:classId",authMiddleware, getAssignmentsByClass);
router.get("/:assignmentId/submissions", authMiddleware, getSubmissionsByAssignment);

export default router;
