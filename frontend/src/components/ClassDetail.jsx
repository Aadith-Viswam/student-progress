// src/components/ClassDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getUserProfile, signupUser } from "../backend/authApi";
import { getClassById, viewStudentsByClass } from "../backend/tApis";
import { motion, AnimatePresence } from "framer-motion";

export default function ClassDetail() {
    const { id } = useParams(); // class ID
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [students, setStudents] = useState([]);
    const [className, setClassName] = useState("Class");
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "", regno: "" });
    const [formLoading, setFormLoading] = useState(false);
    const [message, setMessage] = useState(null);

    // Fetch profile
    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getUserProfile();
            if (data) setProfile(data);
        };
        fetchProfile();
    }, []);

    // Fetch students and class
    useEffect(() => {
        const fetchClassAndStudents = async () => {
            setLoading(true);
            try {
                const cls = await getClassById(id);
                setClassName(cls?.classname || "Class");
                // Fetch students
                const studentsList = await viewStudentsByClass(id);
                setStudents(studentsList);

            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };
        fetchClassAndStudents();
    }, [id]);

    // Modal handlers
    const handleAddStudentClick = () => {
        setModalOpen(true);
        setForm({ name: "", email: "", password: "", regno: "" });
        setMessage(null);
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const data = await signupUser({
                ...form,
                role: "student",
                classId: id,
            });

            // Construct new student object consistent with API structure
            const newStudent = {
                _id: data.user.id,
                regno: form.regno,
                progress: [],
                classId: { _id: id, classname: className },
                userId: {
                    _id: data.user.id,
                    name: form.name,
                    email: form.email,
                    role: "student",
                },
            };

            setStudents((prev) => [...prev, newStudent]);
            setMessage({ type: "success", text: "Student added successfully" });
            setForm({ name: "", email: "", password: "", regno: "" });
            setModalOpen(false);
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Error adding student" });
        }
        setFormLoading(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar profile={profile} />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold text-slate-900">{className}</h1>
                    <motion.button
                        onClick={handleAddStudentClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
                    >
                        + Add Student
                    </motion.button>
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="col-span-full text-center text-gray-500">Loading...</p>
                    ) : students.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">
                            No students in this class yet.
                        </p>
                    ) : (
                        students.map((student) => (
                            <motion.div
                                key={student._id}
                                className="bg-white rounded-2xl shadow-lg shadow-indigo-100/50 p-6 border border-slate-200/60 cursor-pointer"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(`/dashboard/students/${student.userId._id}`)}
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{student.userId.name}</h3>
                                <p className="text-sm text-slate-600">Email: {student.userId.email}</p>
                                <p className="text-sm text-slate-600">Reg No: {student.regno || "N/A"}</p>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Add Student Modal */}
                <AnimatePresence>
                    {modalOpen && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-8 w-full max-w-md relative"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                            >
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
                                >
                                    ×
                                </button>

                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Student</h2>

                                {message && (
                                    <div
                                        className={`mb-4 p-3 rounded text-center font-medium ${message.type === "success"
                                                ? "bg-green-100 text-green-700 border border-green-200"
                                                : "bg-red-100 text-red-700 border border-red-200"
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="regno"
                                        placeholder="Registration Number"
                                        value={form.regno}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        required
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        required
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={formLoading}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl shadow-lg"
                                    >
                                        {formLoading ? "Adding..." : "Add Student"}
                                    </motion.button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
