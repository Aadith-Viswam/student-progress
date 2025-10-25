import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // ✅ Your backend URL
  withCredentials: true, // ✅ Important for sending cookies/auth headers
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
