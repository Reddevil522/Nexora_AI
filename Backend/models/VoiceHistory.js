import mongoose from "mongoose";

/**
 * VoiceHistory Schema
 * Stores every voice exchange: user transcript + AI reply.
 * Linked to a user and optionally to a chat thread.
 */
const VoiceHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    threadId: {
        type: String,
        default: null   // optional — voice can be used outside a named thread
    },
    transcript: {
        type: String,
        required: true,
        trim: true
    },
    aiReply: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for efficient per-user history queries
VoiceHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("VoiceHistory", VoiceHistorySchema);
