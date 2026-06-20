import Thread from "../models/Thread.js";

const checkThreadOwnership = async (req, res, next) => {
    try {
        // The frontend sends threadId either in params (GET/DELETE /thread/:id) or body (POST /chat)
        const threadId = req.params.threadId || req.body.threadId;

        if (!threadId) {
            return res.status(400).json({ error: "Thread ID is required" });
        }

        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        if (thread.userId.toString() !== req.userId.toString()) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        req.thread = thread;
        next();
    } catch (err) {
        console.error("Thread ownership verification failed:", err);
        res.status(500).json({ error: "Server error verifying thread" });
    }
};

export default checkThreadOwnership;
