import Mark from "../models/markModel.js";
import Assignment from "../models/assignmentModel.js";

// Student submits assignment
export const submitAssignment = async (req, res) => {
  try {
    const { marks, feedback } = req.body;
    const { assignmentId } = req.params;

    // 1️⃣ Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // 2️⃣ Only students can submit
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied. Only students can submit assignments." });
    }

    // 3️⃣ Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    // 4️⃣ Check if student already submitted
    let submission = await Mark.findOne({ assignmentId, studentId: req.user._id });

    if (submission) {
      // Update existing submission
      submission.marks = marks || submission.marks;
      submission.feedback = feedback || submission.feedback;
      submission.file = req.file ? req.file.path : submission.file;
      await submission.save();
    } else {
      // Create new submission
      submission = new Mark({
        assignmentId,
        studentId: req.user._id,
        marks: marks || 0, // default 0 if not provided
        feedback: feedback || "",
        file: req.file ? req.file.path : null
      });

      await submission.save();
    }

    res.status(200).json({ message: "Assignment submitted successfully", submission });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while submitting assignment" });
  }
};
