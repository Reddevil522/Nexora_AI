import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    threadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
        required: true
    },
    role: {
        type: String,
        enum: ["user", "assistant"],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

MessageSchema.index({ threadId: 1 });

export default mongoose.model("Message", MessageSchema);
