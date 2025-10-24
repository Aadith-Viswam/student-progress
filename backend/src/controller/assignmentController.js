import Assignment from "../models/assignmentModel.js";
import ClassModel from "../models/classModel.js";

// Controller to create assignment
export const createAssignment = async (req, res) => {
  try {
    const { title, subject } = req.body;
    const { classId } = req.params;

    // 1️⃣ Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // 2️⃣ Only teachers can create assignments
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Access denied. Only teachers can create assignments." });
    }

    // 3️⃣ Check if class exists
    const classExists = await ClassModel.findById(classId);
    if (!classExists) {
      return res.status(404).json({ message: "Class not found." });
    }

    // 4️⃣ Create assignment
    const newAssignment = new Assignment({
      title,
      subject,
      teacherId: req.user._id, // automatically from logged-in teacher
      classId
    });

    await newAssignment.save();

    res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating assignment" });
  }
};
