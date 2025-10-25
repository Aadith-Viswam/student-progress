import Mark from "../models/markModel.js";
import Assignment from "../models/assignmentModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose"
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
        marks: marks || 0,
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


export const getStudentDetailsByUser = async (req, res) => {
  try {
    const { id } = req.params; // user ID

    const studentDetails = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id), role: "student" } },

      // Lookup Student info
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "userId",
          as: "studentInfo"
        }
      },
      { $unwind: "$studentInfo" },

      // Lookup Class info
      {
        $lookup: {
          from: "classes",
          localField: "studentInfo.classId",
          foreignField: "_id",
          as: "classInfo"
        }
      },
      { $unwind: "$classInfo" },

      // Lookup Marks info
      {
        $lookup: {
          from: "marks",
          localField: "studentInfo._id",
          foreignField: "studentId",
          as: "marksInfo"
        }
      },

      // Lookup Assignments info for each mark
      {
        $lookup: {
          from: "assignments",
          localField: "marksInfo.assignmentId",
          foreignField: "_id",
          as: "assignmentsInfo"
        }
      },

      // Project only the fields we need
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          "studentInfo.regno": 1,
          "studentInfo.progress": 1,
          "studentInfo.createdAt": 1,
          "studentInfo.updatedAt": 1,
          "classInfo.classname": 1,
          "classInfo.createdAt": 1,
          marksInfo: 1,
          assignmentsInfo: 1
        }
      }
    ]);

    if (!studentDetails || studentDetails.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(studentDetails[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};