import Thread from "../models/Thread.js";
import Message from "../models/Message.js";

// Get all threads for the current user
export const getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find({ userId: req.userId }).sort({ updatedAt: -1 });
        res.json(threads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch threads" });
    }
};

// Get a single thread and its messages
export const getThreadMessages = async (req, res) => {
    try {
        const thread = req.thread; // attached by checkThreadOwnership middleware
        const messages = await Message.find({ threadId: thread._id }).sort({ createdAt: 1 });
        
        res.json({
            thread,
            messages
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch chat" });
    }
};

// Delete a thread and its messages
export const deleteThread = async (req, res) => {
    try {
        const thread = req.thread; // attached by checkThreadOwnership middleware
        
        await Message.deleteMany({ threadId: thread._id });
        await Thread.findByIdAndDelete(thread._id);
        
        res.status(200).json({ success: "Thread deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete thread" });
    }
};
