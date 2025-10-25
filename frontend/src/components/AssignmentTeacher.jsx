import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubmissionsByAssignment } from "../backend/tApis";
import { motion } from "framer-motion";

export default function AssignmentSubmissions() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState("");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSubmissionsByAssignment(assignmentId);
        console.log("Fetched data:", data);
        setAssignment(data.assignment || "");
        setSubmissions(data.submissions || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [assignmentId]);

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading submissions...</p>;
  if (error)
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!submissions.length)
    return <p className="text-center text-gray-500 mt-10">No submissions yet.</p>;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
      >
        ← Back
      </motion.button>

      <h1 className="text-3xl font-bold text-slate-900 mb-4">
        Submissions for: <span className="text-blue-700">{assignment}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions.map((sub) => (
          <motion.div
            key={sub._id}
            whileHover={{ scale: 1.03 }}
            className="bg-white rounded-2xl shadow-md p-6 border border-slate-200 hover:shadow-xl transition-all"
          >
            <h2 className="text-xl font-semibold text-blue-700 mb-2">
              {sub.studentId?.name || "Unknown Student"}
            </h2>
            <p className="text-gray-700 mb-1">
              <strong>Email:</strong> {sub.studentId?.email || "N/A"}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Marks:</strong> {sub.marks ?? "Not graded"}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Feedback:</strong> {sub.feedback || "No feedback yet"}
            </p>

            {sub.file && (
              <a
                href={`/${sub.file.replace(/\\/g, "/")}`} // fix for backslashes in Windows paths
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow"
              >
                📄 View Submission
              </a>
            )}

            <p className="text-xs text-gray-400 mt-3">
              Submitted: {new Date(sub.createdAt).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
