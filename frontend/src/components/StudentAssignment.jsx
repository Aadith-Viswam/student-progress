// src/components/ClassAssignments.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { viewAssignmentsByClass } from "../backend/tApis";
import { submitAssignment } from "../backend/sApis";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Upload,
  FileText,
  Calendar,
  User,
  Mail,
  BookOpen,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  File,
  AlertCircle,
  CheckCheck,
  Paperclip
} from "lucide-react";

export default function ClassAssignments() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await viewAssignmentsByClass(id);
        setAssignments(data);
      } catch (err) {
        setError("Failed to fetch assignments");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [id]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !selectedAssignment) {
      setMessage({ type: "error", text: "Please select a file before uploading." });
      return;
    }

    setUploading(true);
    try {
      await submitAssignment(selectedAssignment._id, selectedFile);
      setMessage({ type: "success", text: "Assignment submitted successfully!" });
      setUploadModalOpen(false);
      setSelectedFile(null);
      // Refresh assignments
      const data = await viewAssignmentsByClass(id);
      setAssignments(data);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Error uploading assignment." });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
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

  if (!assignments.length) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mb-6 flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl shadow-lg border border-slate-200"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </motion.button>
        
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-12 text-center border border-slate-200">
          <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">No Assignments Yet</h2>
          <p className="text-slate-600 text-lg">There are no assignments available for this class at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
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
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
                  Class Assignments
                </h1>
                <p className="text-slate-600 mt-1">
                  {assignments.length} {assignments.length === 1 ? 'assignment' : 'assignments'} available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {assignments.map((assignment, index) => (
            <motion.div
              key={assignment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Card Header with Gradient */}
              <div className={`h-3 bg-linear-to-r ${
                assignment.submitted 
                  ? 'from-green-500 to-emerald-500' 
                  : 'from-orange-500 to-red-500'
              }`}></div>

              <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    assignment.submitted
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-orange-100 text-orange-700 border border-orange-200'
                  }`}>
                    {assignment.submitted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Submitted
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4" />
                        Pending
                      </>
                    )}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-start gap-2">
                  <FileText className="w-6 h-6 text-indigo-600 mt-1 shrink-0" />
                  {assignment.title}
                </h2>

                {/* Subject */}
                <div className="flex items-center gap-2 mb-4 text-slate-700">
                  <div className="w-8 h-8 bg-linear-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                  </div>
                  <span className="font-semibold">{assignment.subject}</span>
                </div>

                {/* Description */}
                <div className="bg-slate-50 rounded-2xl p-4 mb-4">
                  <p className="text-slate-700 leading-relaxed">
                    {assignment.description}
                  </p>
                </div>

                {/* Teacher Info */}
                {assignment.teacherId && (
                  <div className="bg-linear-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4 border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{assignment.teacherId.name}</p>
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Mail className="w-3 h-3" />
                          {assignment.teacherId.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {new Date(assignment.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>

                {/* Marks and Feedback Section (Only for Submitted) */}
                {assignment.submitted && (assignment.marks || assignment.feedback) && (
                  <div className="bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 mb-4 border-2 border-indigo-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Evaluation</h3>
                    </div>
                    
                    {/* Marks */}
                    {assignment.marks !== undefined && assignment.marks !== null && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">Your Score</span>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
                              {assignment.marks}
                            </span>
                            <span className="text-lg font-semibold text-slate-500">/100</span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-white/80 rounded-full h-3 overflow-hidden shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${assignment.marks}%` }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              assignment.marks >= 90
                                ? 'bg-linear-to-r from-green-500 to-emerald-500'
                                : assignment.marks >= 75
                                ? 'bg-linear-to-r from-blue-500 to-cyan-500'
                                : assignment.marks >= 60
                                ? 'bg-linear-to-r from-yellow-500 to-orange-500'
                                : 'bg-linear-to-r from-red-500 to-pink-500'
                            }`}
                          />
                        </div>
                        {/* Grade Badge */}
                        <div className="mt-2 flex justify-end">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            assignment.marks >= 90
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : assignment.marks >= 75
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : assignment.marks >= 60
                              ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              : 'bg-red-100 text-red-700 border border-red-200'
                          }`}>
                            {assignment.marks >= 90
                              ? '🌟 Excellent'
                              : assignment.marks >= 75
                              ? '✨ Good'
                              : assignment.marks >= 60
                              ? '👍 Satisfactory'
                              : '📚 Needs Improvement'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {assignment.feedback && (
                      <div className="bg-white/80 rounded-xl p-4 border border-indigo-100">
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center shrink-0 mt-0.5">
                            <User className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">
                              Teacher's Feedback
                            </p>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {assignment.feedback}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Upload Button */}
                <motion.button
                  onClick={() => {
                    setSelectedAssignment(assignment);
                    setUploadModalOpen(true);
                    setMessage(null);
                    setSelectedFile(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 font-semibold px-6 py-3.5 rounded-xl shadow-lg transition-all ${
                    assignment.submitted
                      ? 'bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                      : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  {assignment.submitted ? (
                    <>
                      <CheckCheck className="w-5 h-5" />
                      Resubmit Assignment
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Assignment
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {uploadModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setUploadModalOpen(false)}
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
                onClick={() => setUploadModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Upload Assignment</h2>
                  <p className="text-slate-600 text-sm mt-1">Submit your work</p>
                </div>
              </div>

              {/* Assignment Info */}
              {selectedAssignment && (
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border border-blue-100">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{selectedAssignment.title}</p>
                      <p className="text-sm text-slate-600">{selectedAssignment.subject}</p>
                    </div>
                  </div>
                </div>
              )}

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
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    {message.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Select File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.zip,.rar"
                      onChange={handleFileChange}
                      className="w-full border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-6 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-linear-to-r file:from-blue-600 file:to-indigo-600 file:text-white hover:file:from-blue-700 hover:file:to-indigo-700 file:cursor-pointer"
                      required
                    />
                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl"
                      >
                        <Paperclip className="w-4 h-4 text-indigo-600" />
                        <span className="font-medium">{selectedFile.name}</span>
                        <span className="text-slate-500">
                          ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Accepted formats: PDF, DOC, DOCX, ZIP, RAR
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: uploading ? 1 : 1.02 }}
                  whileTap={{ scale: uploading ? 1 : 0.98 }}
                  className={`w-full flex items-center justify-center gap-2 font-semibold py-4 rounded-xl shadow-lg transition-all ${
                    uploading
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Submit Assignment
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}