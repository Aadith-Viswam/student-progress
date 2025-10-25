import express from "express"
import dbConnect from "./db/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./route/authRoute.js"
import teacherRoutes from "./route/teacherRoute.js"
import studentRoutes from "./route/studentRoute.js"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express()
const PORT = 3000;
dotenv.config()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json())
app.use(cookieParser())

app.use("/api", authRoutes);
app.use("/api/teacher", teacherRoutes)
app.use("/api/student", studentRoutes)
dbConnect()
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})