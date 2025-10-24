import ClassModel from "../models/classModel.js";
import Teacher from "../models/teacherModel.js";

// Controller to create a class
export const createClass = async (req, res) => {
  try {
    const { classname } = req.body;

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
