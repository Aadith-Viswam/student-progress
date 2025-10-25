import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Student from "../models/studentModel.js";
import Teacher from "../models/teacherModel.js";
import ClassModel from "../models/classModel.js"; // in case you need to assign class for student

export const signup = async (req, res) => {
    try {
        const { name, email, password, role, regno, classId, department } = req.body;

        // 1️⃣ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }

        // 2️⃣ Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3️⃣ Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        if (role === "student") {
            if (!regno || !classId) {
                return res.status(400).json({ message: "Student must have regno and classId" });
            }
            // Ensure class exists
            const classExists = await ClassModel.findById(classId);
            if (!classExists) {
                return res.status(404).json({ message: "Class not found" });
            }

            const student = new Student({
                userId: newUser._id,
                regno,
                classId,
                progress: [] // start empty
            });

            await student.save();

        } else if (role === "teacher") {
            if (!department) {
                return res.status(400).json({ message: "Teacher must have a department" });
            }

            const teacher = new Teacher({
                userId: newUser._id,
                department
            });

            await teacher.save();
        }

        // 5️⃣ Generate JWT Token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6️⃣ Set JWT in cookie
        res.cookie("token", token, {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // 7️⃣ Respond success
        res.status(201).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                token
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during signup" });
    }
};


// LOGIN Controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1️⃣ Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 2️⃣ Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // 3️⃣ Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 4️⃣ Set JWT in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // 5️⃣ Respond with user info
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export const getUserProfile = async (req, res) => {
  try {
    // 1️⃣ Make sure user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Please login." });
    }

    // 2️⃣ Fetch basic user info
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 3️⃣ Fetch role-specific data
    let roleData = null;
    if (user.role === "student") {
      roleData = await Student.findOne({ userId: user._id })
        .populate("classId", "classname") // include class name if needed
        .select("-__v -createdAt -updatedAt");
    } else if (user.role === "teacher") {
      roleData = await Teacher.findOne({ userId: user._id })
        .select("-__v -createdAt -updatedAt");
    }

    // 4️⃣ Respond with combined data
    res.status(200).json({
      user,
      roleData,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching user profile." });
  }
};
