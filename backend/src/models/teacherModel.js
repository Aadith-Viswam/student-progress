import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  department: {
    type: String,
    required: true,
    trim: true
  },
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
