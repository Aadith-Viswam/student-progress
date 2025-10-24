import mongoose from "mongoose";

const markSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    file: {
        type: String
    },
    marks: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    feedback: {
        type: String,
        trim: true
    }


}, { timestamps: true });

const Mark = mongoose.model("Mark", markSchema);

export default Mark;