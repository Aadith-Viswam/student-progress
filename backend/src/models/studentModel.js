import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  regno: {
    type: String,
    required: true,
    unique: true
  },

  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: true
  },

  progress: [
    {
      subjectName: {
        type: String,
        required: true
      },
      marks: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      }
    }
  ]
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;
