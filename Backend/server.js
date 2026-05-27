import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import getGeminiResponse from "./utils/gemini.js";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);


// DATABASE CONNECTION
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
}

// // API Route
// app.post("/test", async (req, res) => {

//     try {

//         const prompt = req.body.prompt || "Hello!";

//         // Gemini Response
//         const reply = await getGeminiResponse(prompt);

//         // Response in terminal
//         console.log(reply);

//         res.json({
//             success: true,
//             reply: reply,
//         });

//     } catch (err) {

//         console.log(err);

//         res.status(500).json({
//             success: false,
//             error: err.message,
//         });
//     }
// });

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDB();

});