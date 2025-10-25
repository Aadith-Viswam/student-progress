import ClassModel from "../models/classModel.js";
import Mark from "../models/markModel.js";
import Assignment from "../models/assignmentModel.js";
import User from "../models/userModel.js";
import Student from "../models/studentModel.js";

// Controller to create a class
export const createClass = async (req, res) => {
    try {
        const { classname } = req.body;
        console.log("classanme",classname)

        // 2️⃣ Allow only teachers
        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied. Only teachers can create classes." });
        }

        // 4️⃣ Create class
        const newClass = new ClassModel({
            classname,
            userId: req.user._id
        });

        await newClass.save();

        res.status(201).json({ message: "Class created successfully", class: newClass });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while creating class" });
    }
};

// Controller to submit marks
export const submitMarks = async (req, res) => {
    try {
        const { studentId, marks, feedback } = req.body;
        const { assignmentId } = req.params;

        // 1️⃣ Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please login." });
        }

        // 2️⃣ Only teachers can submit marks
        if (req.user.role !== "teacher") {
            return res.status(403).json({ message: "Access denied. Only teachers can submit marks." });
        }

        // 3️⃣ Check if assignment exists and belongs to teacher
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found." });
        }

        if (assignment.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not allowed to submit marks for this assignment." });
        }

        // 4️⃣ Check if student exists
        const student = await User.findById(studentId);
        if (!student || student.role !== "student") {
            return res.status(404).json({ message: "Student not found." });
        }

        // 5️⃣ Create or update marks
        let markEntry = await Mark.findOne({ assignmentId, studentId });

        if (markEntry) {
            // Update existing marks
            markEntry.marks = marks;
            markEntry.feedback = feedback;
            await markEntry.save();
        } else {
            // Create new marks
            markEntry = new Mark({
                assignmentId,
                studentId,
                marks,
                feedback
            });
            await markEntry.save();
        }

        res.status(200).json({ message: "Marks submitted successfully", mark: markEntry });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while submitting marks" });
    }
};


// Controller to create assignment
export const createAssignment = async (req, res) => {
    try {
        const { title, subject, description } = req.body;
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
            classId,
            description
        });

        await newAssignment.save();

        res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error while creating assignment" });
    }
};


// Controller to view student profiles by class
export const viewStudentsByClass = async (req, res) => {
  try {
    const { classId } = req.params;

    // 1️⃣ Validate classId
    if (!classId) {
      return res.status(400).json({ message: "Class ID is required" });
    }

    // 2️⃣ Find students in the class
    const students = await Student.find({ classId })
      .populate({
        path: "userId",
        match: { role: "student" }, // only include users with role student
        select: "name email role"
      })
      .select("regno progress classId"); // include only relevant student fields

    // 3️⃣ Filter out any null userId (in case role mismatch)
    const filteredStudents = students.filter(student => student.userId !== null);

    if (filteredStudents.length === 0) {
      return res.status(404).json({ message: "No students found in this class" });
    }

    res.status(200).json({ students: filteredStudents });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching students" });
  }
};

// View submissions for a specific assignment
export const viewSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    // 1️⃣ Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // 2️⃣ Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // 3️⃣ Students can only view their own submission
    let query = { assignmentId };
    if (req.user.role === "student") {
      query.studentId = req.user._id;
    }

    // 4️⃣ Fetch submissions
    const submissions = await Mark.find(query)
      .populate({
        path: "studentId",
        select: "name email"
      });

    if (submissions.length === 0) {
      return res.status(404).json({ message: "No submissions found for this assignment" });
    }

    res.status(200).json({ assignment: assignment.title, submissions });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching submissions" });
  }
};

export const getClasses = async (req, res) => {
  try {
    const userId = req.user.id; // comes from authenticated token middleware
    const classes = await ClassModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching classes" });
  }
};

export const getClassById = async (req, res) => {
  try {
    const classId = req.params.id;
    const classData = await ClassModel.findById(classId);
    if (!classData) return res.status(404).json({ message: "Class not found" });
    res.json({ class: classData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching class" });
  }
};