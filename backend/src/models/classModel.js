import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  classname: {
    type: String,
    required: true,
    trim: true
  },
  userId: {  // Reference to User model
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ClassModel = mongoose.model("Class", classSchema);

export default ClassModel;
