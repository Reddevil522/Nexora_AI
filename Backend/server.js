import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chatRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);                  // public
app.use("/api/thread", authMiddleware, threadRoutes); // protected
app.use("/api/chat", authMiddleware, chatRoutes);     // protected

// DATABASE CONNECTION
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
};

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDB();
});
