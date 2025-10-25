// src/components/StudentDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentDetails } from "../backend/sApis";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  IdCard,
  Award,
  TrendingUp,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Target,
  Star
} from "lucide-react";

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getStudentDetails(id);
        setStudent(data);
      } catch (err) {
        setError("Failed to fetch student details");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Error</h2>
          </div>
          <p className="text-red-600 mb-6">{error}</p>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200">
          <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">No Student Data</h2>
          <p className="text-slate-600 text-lg mb-6">Student information not found</p>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-3 rounded-xl"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalAssignments = student.marksInfo?.length || 0;
  const averageMarks = totalAssignments > 0
    ? (student.marksInfo.reduce((sum, m) => sum + (Number(m.marks) || 0), 0) / totalAssignments).toFixed(1)
    : 0;
  const highestMarks = totalAssignments > 0
    ? Math.max(...student.marksInfo.map(m => Number(m.marks) || 0))
    : 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
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

        {/* Student Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden mb-8"
        >
          {/* Header with Gradient */}
          <div className="h-32 bg-linear-to-r from-blue-500 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-6 -mt-16 relative">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-white to-slate-50 shadow-2xl flex items-center justify-center mb-6 border-4 border-white">
              <span className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-br from-indigo-600 to-purple-600">
                {student.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{student.name}</h1>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                      <p className="text-sm font-medium text-slate-900">{student.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase">Registration No</p>
                      <p className="text-sm font-medium text-slate-900">{student.studentInfo.regno}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <div className="w-10 h-10 bg-linear-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Class</p>
                    <p className="text-sm font-medium text-slate-900">{student.classInfo.classname}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3">
                  <div className="w-10 h-10 bg-linear-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">Role</p>
                    <p className="text-sm font-medium text-slate-900 capitalize">{student.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-cyan-600">
                  {averageMarks}%
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Highest Score</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600">
                  {highestMarks}%
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-7 h-7 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">Total Assignments</p>
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
                  {totalAssignments}
                </p>
              </div>
              <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"
          >
            <div className="bg-linear-to-r from-green-500 to-emerald-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Progress</h2>
                  <p className="text-white/90 text-sm">Subject-wise performance</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {student.studentInfo.progress && student.studentInfo.progress.length > 0 ? (
                <div className="space-y-4">
                  {student.studentInfo.progress.map((p, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-linear-to-br from-slate-50 to-green-50 rounded-2xl p-4 border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-slate-900">{p.subjectName}</span>
                        </div>
                        <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600">
                          {p.marks}
                        </span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.marks}%` }}
                          transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                          className="h-full bg-linear-to-r from-green-500 to-emerald-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No progress data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Assignments & Marks Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"
          >
            <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Assignments</h2>
                  <p className="text-white/90 text-sm">Marks & feedback</p>
                </div>
              </div>
            </div>

            <div className="p-6 max-h-[600px] overflow-y-auto">
              {student.marksInfo && student.marksInfo.length > 0 ? (
                <div className="space-y-4">
                  {student.marksInfo.map((m, idx) => {
                    const assignment = student.assignmentsInfo?.find(a => a._id === m.assignmentId);
                    const marks = Number(m.marks) || 0;
                    
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="bg-linear-to-br from-slate-50 to-indigo-50 rounded-2xl p-5 border border-slate-200"
                      >
                        {/* Assignment Title */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-2 flex-1">
                            <FileText className="w-5 h-5 text-indigo-600 mt-1 shrink-0" />
                            <div>
                              <h3 className="font-bold text-slate-900 mb-1">
                                {assignment?.title || "N/A"}
                              </h3>
                              {assignment?.subject && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">
                                  <BookOpen className="w-3 h-3" />
                                  {assignment.subject}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                              {marks}
                            </p>
                            <p className="text-xs text-slate-500">out of 100</p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${marks}%` }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                              className={`h-full ${
                                marks >= 90
                                  ? 'bg-linear-to-r from-green-500 to-emerald-500'
                                  : marks >= 75
                                  ? 'bg-linear-to-r from-blue-500 to-cyan-500'
                                  : marks >= 60
                                  ? 'bg-linear-to-r from-yellow-500 to-orange-500'
                                  : 'bg-linear-to-r from-red-500 to-pink-500'
                              }`}
                            />
                          </div>
                        </div>

                        {/* Feedback */}
                        {m.feedback && (
                          <div className="bg-white/80 rounded-xl p-3 border border-indigo-100">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-purple-600 uppercase mb-1">Feedback</p>
                                <p className="text-sm text-slate-700 leading-relaxed">{m.feedback}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Grade Badge */}
                        <div className="mt-3 flex justify-end">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            marks >= 90
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : marks >= 75
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : marks >= 60
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {marks >= 90
                              ? '🌟 Excellent'
                              : marks >= 75
                              ? '✨ Good'
                              : marks >= 60
                              ? '👍 Satisfactory'
                              : '📚 Needs Improvement'}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600">No assignments graded yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}