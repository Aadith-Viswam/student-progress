// src/components/CreateClass.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import { getUserProfile } from "../backend/authApi";
import { createClass, getClass } from "../backend/tApis";
import { useNavigate } from "react-router-dom";

export default function CreateClass() {
    const [profile, setProfile] = useState(null);
    const [classes, setClasses] = useState([]);
    const [loadingClasses, setLoadingClasses] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [classname, setClassname] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();


    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            const data = await getUserProfile();
            if (data) setProfile(data);
        };
        fetchProfile();
    }, []);

    // Fetch teacher classes
    useEffect(() => {
        const fetchClasses = async () => {
            setLoadingClasses(true);
            try {
                const res = await getClass();
                setClasses(res || []);
            } catch (err) {
                console.error(err);
            }
            setLoadingClasses(false);
        };
        fetchClasses();
    }, []);

    const handleCreateClass = async (e) => {
        e.preventDefault();
        if (!classname.trim()) {
            setMessage({ type: "error", text: "Class name is required" });
            return;
        }

        setLoading(true);
        try {
            const res = await createClass({ classname });
            setMessage({ type: "success", text: res.message });
            setClasses((prev) => [...prev, res.class]); // Append new class
            setClassname("");
            setModalOpen(false); // Close modal
        } catch (err) {
            setMessage({ type: "error", text: err.message || "Error creating class" });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar profile={profile} />

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                {/* Header */}
                <motion.div
                    className="mb-10 flex items-center justify-between"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700 mb-2">
                            Classes
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Create new classes and manage existing ones
                        </p>
                    </div>
                    <motion.button
                        onClick={() => setModalOpen(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
                    >
                        + New Class
                    </motion.button>
                </motion.div>

                {/* Classes List */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {loadingClasses ? (
                        <p className="col-span-full text-center text-gray-500">Loading classes...</p>
                    ) : classes.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No classes yet. Create one!</p>
                    ) : (
                        classes.map((cls) => (
                            <motion.div
                                key={cls._id}
                                className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-6 border border-slate-200/60 cursor-pointer"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate(`/dashboard/classes/${cls._id}`)} // navigate with ID
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{cls.classname}</h3>
                                <p className="text-sm text-slate-600">
                                    Created on: {new Date(cls.createdAt).toLocaleDateString()}
                                </p>
                            </motion.div>
                        ))

                    )}
                </motion.div>

                {/* Create Class Modal */}
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
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Class</h2>

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

                                <form onSubmit={handleCreateClass} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Class Name</label>
                                        <input
                                            type="text"
                                            value={classname}
                                            onChange={(e) => setClassname(e.target.value)}
                                            placeholder="Enter class name"
                                            className="w-full border border-gray-300 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-2xl shadow-lg"
                                    >
                                        {loading ? "Creating..." : "Create Class"}
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
