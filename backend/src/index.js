import express from "express"
import dbConnect from "./db/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import authRoutes from "./route/authRoute.js"

const app = express()
const PORT = 3000;
dotenv.config()
app.use(express.json())
app.use(cookieParser())

app.use("/api", authRoutes);
dbConnect()
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})