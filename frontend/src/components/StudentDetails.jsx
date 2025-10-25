// src/components/StudentDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudentDetails } from "../backend/sApis";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function StudentDetailPage() {
    const { id } = useParams(); // get userId from route params
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

    if (loading) return <p>Loading student details...</p>;
    if (error) return <p>{error}</p>;
    if (!student) return <p>No student data found</p>;

    return (

        <div className="p-5">
            <motion.button
  onClick={() => navigate(-1)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-lg"
>
  ← Back
</motion.button>

            <h1 className="text-2xl font-bold mb-4">{student.name}</h1>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Role:</strong> {student.role}</p>
            <p><strong>Class:</strong> {student.classInfo.classname}</p>
            <p><strong>Reg No:</strong> {student.studentInfo.regno}</p>

            <h2 className="text-xl font-semibold mt-5">Progress</h2>
            <ul className="list-disc ml-5">
                {student.studentInfo.progress.map((p, idx) => (
                    <li key={idx}>{p.subjectName}: {p.marks}</li>
                ))}
            </ul>

            <h2 className="text-xl font-semibold mt-5">Marks & Assignments</h2>
            <ul className="list-disc ml-5">
                {student.marksInfo.map((m, idx) => {
                    const assignment = student.assignmentsInfo.find(a => a._id === m.assignmentId);
                    return (
                        <li key={idx}>
                            <strong>Assignment:</strong> {assignment?.title || "N/A"} <br />
                            <strong>Marks:</strong> {m.marks} <br />
                            <strong>Feedback:</strong> {m.feedback || "No feedback"}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
