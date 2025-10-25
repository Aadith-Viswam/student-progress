import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TeacherSignup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import RootRedirect from "./components/RootRedirect";
import "./App.css"
import CreateClass from "./components/Class";
import ClassDetail from "./components/ClassDetail";
import StudentDetailPage from "./components/StudentDetails";
import ClassAssignments from "./components/StudentAssignment";
import AssignmentSubmissions from "./components/AssignmentTeacher";

function App() {
  return (
    <Router>
      <Routes>
        {/* root route now redirects automatically */}
        <Route path="/" element={<RootRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<TeacherSignup />} />
        <Route path="/classes" element={<CreateClass />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/classes" element={<CreateClass />} />
        <Route path="/dashboard/classes/:id" element={<ClassDetail />} />
        <Route path="/dashboard/students/:id" element={<StudentDetailPage />} />
        <Route path="/dashboard/assignment/:id" element={<ClassAssignments />} />
        <Route path="/dashboard/assignments/:assignmentId/submissions" element={<AssignmentSubmissions />} />
      </Routes>

    </Router>
  );
}

export default App;
