import express from "express"
import dbConnect from "./db/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./route/authRoute.js"
import teacherRoutes from "./route/teacherRoute.js"
import studentRoutes from "./route/studentRoute.js"

const app = express()
const PORT = 3000;
dotenv.config()
app.use(express.json())
app.use(cookieParser())

app.use("/api", authRoutes);
app.use("/api/teacher",teacherRoutes)
app.use("/api/student",studentRoutes)
dbConnect()
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})