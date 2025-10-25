// src/components/ClassDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getUserProfile, signupUser } from "../backend/authApi";
import { getClassById, viewStudentsByClass, viewAssignmentsByClass, createAssignment } from "../backend/tApis";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Users,
  UserPlus,
  FileText,
  Plus,
  X,
  Mail,
  Lock,
  User,
  Hash,
  BookOpen,
  GraduationCap,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  IdCard,
  Briefcase,
  Calendar,
  Search
} from "lucide-react";

export default function ClassDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [className, setClassName] = useState("Class");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Student modal
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState({ name: "", email: "", password: "", regno: "" });
  const [studentFormLoading, setStudentFormLoading] = useState(false);
  const [studentMessage, setStudentMessage] = useState(null);

  // Assignment modal
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({ title: "", subject: "", description: "" });
  const [assignmentFormLoading, setAssignmentFormLoading] = useState(false);
  const [assignmentMessage, setAssignmentMessage] = useState(null);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  // Fetch students, assignments, and class
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cls = await getClassById(id);
        setClassName(cls?.classname || "Class");

        const studentsList = await viewStudentsByClass(id);
        setStudents(studentsList);

        const assignmentsList = await viewAssignmentsByClass(id);
        setAssignments(assignmentsList);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Student handlers
  const handleStudentChange = (e) =>
    setStudentForm({ ...studentForm, [e.target.name]: e.target.value });

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setStudentFormLoading(true);
    setStudentMessage(null);
    try {
      const data = await signupUser({ ...studentForm, role: "student", classId: id });
      const newStudent = {
        _id: data.user.id,
        regno: studentForm.regno,
        progress: [],
        classId: { _id: id, classname: className },
        userId: { _id: data.user.id, name: studentForm.name, email: studentForm.email, role: "student" },
      };
      setStudents((prev) => [...prev, newStudent]);
      setStudentMessage({ type: "success", text: "Student added successfully" });
      setStudentForm({ name: "", email: "", password: "", regno: "" });
      setTimeout(() => setStudentModalOpen(false), 1500);
    } catch (err) {
      setStudentMessage({ type: "error", text: err.message || "Error adding student" });
    }
    setStudentFormLoading(false);
  };

  // Assignment handlers
  const handleAssignmentChange = (e) =>
    setAssignmentForm({ ...assignmentForm, [e.target.name]: e.target.value });

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setAssignmentFormLoading(true);
    setAssignmentMessage(null);
    try {
      await createAssignment(id, assignmentForm);
      const updatedAssignments = await viewAssignmentsByClass(id);
      setAssignments(updatedAssignments);

      setAssignmentMessage({ type: "success", text: "Assignment created successfully" });
      setAssignmentForm({ title: "", subject: "", description: "" });
      setTimeout(() => setAssignmentModalOpen(false), 1500);
    } catch (err) {
      setAssignmentMessage({ type: "error", text: err.message || "Error creating assignment" });
    }
    setAssignmentFormLoading(false);
  };

  // Filter students based on search
  const filteredStudents = students.filter(student => 
    student.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.userId.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.regno.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar profile={profile} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mb-6 flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl shadow-lg border border-slate-200 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/60">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
                  {className}
                </h1>
                <p className="text-slate-600 mt-1">
                  {students.length} Students · {assignments.length} Assignments
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Students Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-500 to-cyan-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Students</h2>
                    <p className="text-white/90 text-sm">{students.length} enrolled</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    setStudentModalOpen(true);
                    setStudentMessage(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white hover:bg-white/90 text-blue-600 font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Add
                </motion.button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-slate-200">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600">Loading students...</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-slate-600 text-lg font-medium">
                    {searchQuery ? "No students found" : "No students yet"}
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    {searchQuery ? "Try a different search term" : "Add your first student to get started"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredStudents.map((student, index) => (
                    <motion.div
                      key={student._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-linear-to-br from-slate-50 to-blue-50 rounded-2xl p-4 border border-slate-200 cursor-pointer hover:shadow-lg transition-all"
                      onClick={() => navigate(`/dashboard/students/${student.userId._id}`)}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                          <span className="text-white font-bold text-lg">
                            {student.userId.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 truncate">
                            {student.userId.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <IdCard className="w-3.5 h-3.5" />
                            <span className="truncate">{student.regno}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-white/60 rounded-lg px-3 py-2">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{student.userId.email}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignments Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-green-500 to-emerald-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Assignments</h2>
                    <p className="text-white/90 text-sm">{assignments.length} created</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => {
                    setAssignmentModalOpen(true);
                    setAssignmentMessage(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-white hover:bg-white/90 text-green-600 font-semibold px-4 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Add
                </motion.button>
              </div>
            </div>

            {/* Assignments List */}
            <div className="p-6 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600">Loading assignments...</p>
                </div>
              ) : assignments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-linear-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ClipboardList className="w-10 h-10 text-green-600" />
                  </div>
                  <p className="text-slate-600 text-lg font-medium">No assignments yet</p>
                  <p className="text-slate-500 text-sm mt-1">Create your first assignment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {assignments.map((assgn, index) => (
                    <motion.div
                      key={assgn._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={()=> navigate(`/dashboard/assignments/${assgn._id}/submissions`)}
                      className="bg-linear-to-br from-slate-50 to-green-50 rounded-2xl p-5 border border-slate-200 cursor-pointer hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {assgn.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1 text-sm font-medium text-slate-700 bg-white/80 rounded-lg px-2.5 py-1">
                              <BookOpen className="w-3.5 h-3.5 text-green-600" />
                              {assgn.subject}
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {assgn.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Student Modal */}
        <AnimatePresence>
          {studentModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStudentModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setStudentModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <UserPlus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Add Student</h2>
                    <p className="text-slate-600 text-sm mt-1">Create a new student account</p>
                  </div>
                </div>

                <AnimatePresence>
                  {studentMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-6 p-4 rounded-xl font-medium flex items-center gap-3 ${
                        studentMessage.type === "success"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {studentMessage.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      {studentMessage.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleStudentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={studentForm.name}
                        onChange={handleStudentChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        name="email"
                        placeholder="student@example.com"
                        value={studentForm.email}
                        onChange={handleStudentChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Registration Number
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="regno"
                        placeholder="REG12345"
                        value={studentForm.regno}
                        onChange={handleStudentChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={studentForm.password}
                        onChange={handleStudentChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={studentFormLoading}
                    whileHover={{ scale: studentFormLoading ? 1 : 1.02 }}
                    whileTap={{ scale: studentFormLoading ? 1 : 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl shadow-lg transition-all ${
                      studentFormLoading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    }`}
                  >
                    {studentFormLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Adding Student...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Add Student
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Assignment Modal */}
        <AnimatePresence>
          {assignmentModalOpen && (
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAssignmentModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg relative"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setAssignmentModalOpen(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">Add Assignment</h2>
                    <p className="text-slate-600 text-sm mt-1">Create a new assignment</p>
                  </div>
                </div>

                <AnimatePresence>
                  {assignmentMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-6 p-4 rounded-xl font-medium flex items-center gap-3 ${
                        assignmentMessage.type === "success"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {assignmentMessage.type === "success" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      {assignmentMessage.text}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Assignment Title
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="title"
                        placeholder="Math Assignment #1"
                        value={assignmentForm.title}
                        onChange={handleAssignmentChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Subject
                    </label>
                    <div className="relative">
                      <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        name="subject"
                        placeholder="Mathematics"
                        value={assignmentForm.subject}
                        onChange={handleAssignmentChange}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe the assignment requirements..."
                      value={assignmentForm.description}
                      onChange={handleAssignmentChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={assignmentFormLoading}
                    whileHover={{ scale: assignmentFormLoading ? 1 : 1.02 }}
                    whileTap={{ scale: assignmentFormLoading ? 1 : 0.98 }}
                    className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl shadow-lg transition-all ${
                      assignmentFormLoading
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    }`}
                  >
                    {assignmentFormLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Assignment...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Assignment
                      </>
                    )}
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