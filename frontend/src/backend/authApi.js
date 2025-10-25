import api from "./axios";

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Signup failed" };
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/logout"); // call your backend logout
    // redirect to login
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed", error);
  }
};
// ✅ Login function
export const loginUser = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export const checkAuth = async () => {
  try {
    const res = await api.get("/check");
    return res;

  } catch (err) {
    return null; // not logged in
  }
};

export const getUserProfile = async () => {
  try {
    const res = await api.get("/profile"); 
    return res.data; 
  } catch (err) {
    console.error("Error fetching user profile:", err.response?.data);
    return null;
  }
};