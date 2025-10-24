import mongoose from "mongoose";
async function dbConnect() {
    try {
        await mongoose.connect(`${process.env.DB_URI}`)
    } catch (e) {
        console.log(e);
    }
}
export default dbConnect; 