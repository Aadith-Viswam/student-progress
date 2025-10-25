import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import TeacherSignup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import RootRedirect from "./components/RootRedirect";
import CreateClass from "./components/Class";
import ClassDetail from "./components/ClassDetail";
import StudentDetailPage from "./components/StudentDetails";
import ClassAssignments from "./components/StudentAssignment";
import AssignmentSubmissions from "./components/AssignmentTeacher";
import Navbar from "./components/Navbar";
import "./App.css";
import { useEffect, useState } from "react";
import { getUserProfile } from "./backend/authApi";

// Wrapper component to use useLocation
function AppWrapper() {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, []);

  // Show Navbar on all routes except "/", "/login", "/signup"
  const showNavbar = !["/", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar profile={profile} />}

      <Routes>
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
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
