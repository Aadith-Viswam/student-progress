// src/pages/TeacherSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../backend/authApi";

function TeacherSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    tokenKey: "", // secret key input
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Token check (frontend validation)
    if (formData.tokenKey !== "TCHR123") {
      setMessage("❌ Invalid teacher access token.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "teacher",
        department: formData.department,
      };

      const res = await signupUser(payload);
      localStorage.setItem("token", res?.user?.token);
      setMessage("✅ " + res.message);
    } catch (err) {
      setMessage(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Teacher Signup
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        {/* Secret Token Field */}
        <input
          type="text"
          name="tokenKey"
          placeholder="Enter Teacher Access Token"
          value={formData.tokenKey}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {message && (
          <p
            className={`text-center mt-3 text-sm ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default TeacherSignup;
