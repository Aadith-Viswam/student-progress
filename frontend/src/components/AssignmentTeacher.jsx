import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissionsByAssignment, submitMarks } from "../backend/tApis";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Download,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Send,
  Award,
  MessageSquare,
  Clock,
  Users,
  ClipboardList,
  Star,
  TrendingUp
} from "lucide-react";

export default function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markInputs, setMarkInputs] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [successMessage, setSuccessMessage] = useState({});

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSubmissionsByAssignment(assignmentId);
        setAssignment(data.assignment || "");
        setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);

        const initialInputs = {};
        (data.submissions || []).forEach(sub => {
          initialInputs[sub._id] = {
            marks: sub.marks ?? "",
            feedback: sub.feedback ?? ""
          };
        });
        setMarkInputs(initialInputs);
      } catch (err) {
        console.error(err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  const handleInputChange = (subId, field, value) => {
    setMarkInputs(prev => ({
      ...prev,
      [subId]: { ...prev[subId], [field]: value }
    }));
  };

  const handleSubmit = async (subId, studentId) => {
    try {
      setSubmitting(prev => ({ ...prev, [subId]: true }));
      const { marks, feedback } = markInputs[subId];
      await submitMarks(assignmentId, { studentId, marks, feedback });
      setSuccessMessage(prev => ({ ...prev, [subId]: true }));
      setTimeout(() => {
        setSuccessMessage(prev => ({ ...prev, [subId]: false }));
      }, 3000);
    } catch (err) {
      alert(err.message || "Failed to submit marks");
    } finally {
      setSubmitting(prev => ({ ...prev, [subId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading submissions...</p>
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

  if (!submissions || submissions.length === 0) {
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
            <ClipboardList className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">No Submissions Yet</h2>
          <p className="text-slate-600 text-lg">Students haven't submitted this assignment yet.</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const gradedCount = submissions.filter(s => s.marks !== null && s.marks !== undefined && s.marks !== "").length;
  const averageMarks = gradedCount > 0 
    ? (submissions.reduce((sum, s) => sum + (Number(s.marks) || 0), 0) / gradedCount).toFixed(1)
    : "N/A";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200/60 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
                  Submissions
                </h1>
                <p className="text-slate-600 mt-1 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {assignment}
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-600 mb-1">Total Submissions</p>
                    <p className="text-3xl font-bold text-slate-900">{totalSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-green-600 mb-1">Graded</p>
                    <p className="text-3xl font-bold text-slate-900">{gradedCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-purple-600 mb-1">Average Score</p>
                    <p className="text-3xl font-bold text-slate-900">{averageMarks}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {submissions.map((sub, index) => {
            const currentMarks = markInputs[sub._id]?.marks;
            const hasBeenGraded = sub.marks !== null && sub.marks !== undefined && sub.marks !== "";
            
            return (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden hover:shadow-2xl transition-all h-full"
              >
                {/* Status Bar */}
                <div className={`h-2 ${hasBeenGraded ? 'bg-linear-to-r from-green-500 to-emerald-500' : 'bg-linear-to-r from-orange-500 to-yellow-500'}`}></div>

                <div className="p-6">
                  {/* Student Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">
                        {sub.studentId?.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-slate-900 truncate">
                        {sub.studentId?.name || "Unknown Student"}
                      </h2>
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5" />
                        <span className="truncate">{sub.studentId?.email || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      hasBeenGraded
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {hasBeenGraded ? (
                        <>
                          <Star className="w-3.5 h-3.5" />
                          Graded
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Pending Review
                        </>
                      )}
                    </span>
                  </div>

                  {/* Download Button */}
                  {sub.file && (
                    <a
                      href={`http://localhost:3000/uploads/${sub.file.split("\\").pop()}`}
                      download
                      className="flex items-center justify-center gap-2 w-full bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold px-4 py-3 rounded-xl shadow-lg mb-6 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download Submission
                    </a>
                  )}

                  {/* Grading Section */}
                  <div className="space-y-4">
                    {/* Marks Input */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <Award className="w-4 h-4 text-indigo-600" />
                        Marks (out of 100)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={markInputs[sub._id]?.marks || ""}
                          onChange={(e) => handleInputChange(sub._id, "marks", e.target.value)}
                          placeholder="Enter marks"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-900"
                        />
                        {currentMarks && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <span className={`text-sm font-bold ${
                              currentMarks >= 90 ? 'text-green-600' :
                              currentMarks >= 75 ? 'text-blue-600' :
                              currentMarks >= 60 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {currentMarks >= 90 ? '🌟' :
                               currentMarks >= 75 ? '✨' :
                               currentMarks >= 60 ? '👍' : '📚'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Feedback Input */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        Feedback
                      </label>
                      <textarea
                        value={markInputs[sub._id]?.feedback || ""}
                        onChange={(e) => handleInputChange(sub._id, "feedback", e.target.value)}
                        placeholder="Provide constructive feedback..."
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-slate-900 resize-none"
                      />
                    </div>

                    {/* Success Message */}
                    <AnimatePresence>
                      {successMessage[sub._id] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-3 rounded-xl border border-green-200"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-medium text-sm">Marks submitted successfully!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <motion.button
                      onClick={() => handleSubmit(sub._id, sub.studentId._id)}
                      disabled={submitting[sub._id]}
                      whileHover={{ scale: submitting[sub._id] ? 1 : 1.02 }}
                      whileTap={{ scale: submitting[sub._id] ? 1 : 0.98 }}
                      className={`w-full flex items-center justify-center gap-2 font-semibold py-3.5 rounded-xl shadow-lg transition-all ${
                        submitting[sub._id]
                          ? 'bg-slate-400 cursor-not-allowed'
                          : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
                      }`}
                    >
                      {submitting[sub._id] ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Submit Evaluation
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Submission Date */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                    <Calendar className="w-4 h-4" />
                    <span>Submitted: {new Date(sub.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}