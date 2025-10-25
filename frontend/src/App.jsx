import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import TeacherSignup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import RootRedirect from "./components/RootRedirect";
import "./App.css"

function App() {
  return (
    <Router>
      <Routes>
        {/* root route now redirects automatically */}
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<TeacherSignup />} />
        <Route
          path="/dashboard"
          element={

            <Dashboard />

          }
        />
      </Routes>
    </Router>
  );
}

export default App;
