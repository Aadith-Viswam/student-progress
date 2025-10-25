// src/components/CreateClass.jsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import { getUserProfile } from "../backend/authApi";
import { createClass, getClass } from "../backend/tApis";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Folder,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  School,
  ChevronRight
} from "lucide-react";

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
    setMessage(null);
    try {
      const res = await createClass({ classname });
      setMessage({ type: "success", text: res.message });
      setClasses((prev) => [...prev, res.class]);
      setClassname("");
      setTimeout(() => setModalOpen(false), 1500);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Error creating class" });
    }
    setLoading(false);
  };

  // Color palette for class cards
  const colorSchemes = [
    { gradient: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", icon: "blue" },
    { gradient: "from-purple-500 to-pink-500", bg: "from-purple-50 to-pink-50", icon: "purple" },
    { gradient: "from-green-500 to-emerald-500", bg: "from-green-50 to-emerald-50", icon: "green" },
    { gradient: "from-orange-500 to-red-500", bg: "from-orange-50 to-red-50", icon: "orange" },
    { gradient: "from-indigo-500 to-blue-500", bg: "from-indigo-50 to-blue-50", icon: "indigo" },
    { gradient: "from-pink-500 to-rose-500", bg: "from-pink-50 to-rose-50", icon: "pink" },
  ];

  const getColorScheme = (index) => colorSchemes[index % colorSchemes.length];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6 flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl shadow-lg border border-slate-200 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>

        {/* Header Section */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/60">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <School className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700 mb-1">
                    My Classes
                  </h1>
                  <p className="text-slate-600 flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    {classes.length} {classes.length === 1 ? 'class' : 'classes'} created
                  </p>
                </div>
              </div>
              <motion.button
                onClick={() => {
                  setModalOpen(true);
                  setMessage(null);
                  setClassname("");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Create New Class
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Classes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loadingClasses ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">Loading classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200/60">
              <div className="w-24 h-24 bg-linear-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-3">No Classes Yet</h2>
              <p className="text-slate-600 text-lg mb-6">
                Start by creating your first class to organize students and assignments
              </p>
              <motion.button
                onClick={() => {
                  setModalOpen(true);
                  setMessage(null);
                  setClassname("");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Class
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((cls, index) => {
                const colors = getColorScheme(index);
                return (
                  <motion.div
                    key={cls._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`/dashboard/classes/${cls._id}`)}
                  >
                    {/* Header with Gradient */}
                    <div className={`h-32 bg-linear-to-r ${colors.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-grid-white/10"></div>
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                      <div className="relative h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30 group-hover:scale-110 transition-transform">
                          <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                        {cls.classname}
                      </h3>

                      {/* Stats */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className={`w-8 h-8 bg-linear-to-br ${colors.bg} rounded-lg flex items-center justify-center`}>
                            <Users className="w-4 h-4 text-slate-700" />
                          </div>
                          <span className="font-medium">Students enrolled</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <div className={`w-8 h-8 bg-linear-to-br ${colors.bg} rounded-lg flex items-center justify-center`}>
                            <BookOpen className="w-4 h-4 text-slate-700" />
                          </div>
                          <span className="font-medium">Assignments created</span>
                        </div>
                      </div>

                      {/* Created Date */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(cls.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Create Class Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>

                {/* Modal Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Create New Class</h2>
                    <p className="text-slate-600 text-sm mt-1">Add a new class to your dashboard</p>
                  </div>
                </div>

                {/* Message Display */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-6 p-4 rounded-xl font-medium flex items-center gap-3 ${
                        message.type === "success"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {message.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 shrink-0" />
                      )}
                      {message.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleCreateClass} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Class Name
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={classname}
                        onChange={(e) => setClassname(e.target.value)}
                        placeholder="e.g., Computer Science 101"
                        className="w-full pl-12 pr-4 py-3.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-900 placeholder:text-slate-400"
                        required
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Choose a descriptive name for your class
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 rounded-xl transition-all"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className={`flex-1 flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl shadow-lg transition-all ${
                        loading
                          ? "bg-slate-400 cursor-not-allowed"
                          : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      }`}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="w-5 h-5" />
                          Create Class
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>

                {/* Tips Section */}
                <div className="mt-6 bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">Quick Tip</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        After creating a class, you can add students, create assignments, and track progress all in one place.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}