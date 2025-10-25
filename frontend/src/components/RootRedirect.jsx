
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../backend/authApi";

function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const user = await checkAuth();
      console.log("user",user) // call backend to verify token
      if (user) {
        navigate("/dashboard"); // token valid → go dashboard
      } else {
        navigate("/login"); // token missing/invalid → go login
      }
    };
    verifyUser();
  }, [navigate]);

  return <p>Checking authentication...</p>; // or a spinner
}

export default RootRedirect;
