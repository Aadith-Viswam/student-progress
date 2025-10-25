import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TeacherSignup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import RootRedirect from "./components/RootRedirect";
import "./App.css"
import CreateClass from "./components/Class";
import ClassDetail from "./components/ClassDetail";

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
      </Routes>

    </Router>
  );
}

export default App;
