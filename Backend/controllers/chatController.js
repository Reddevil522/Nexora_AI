import Thread from "../models/Thread.js";
import Message from "../models/Message.js";
import getGeminiResponse from "../utils/gemini.js";

export const sendMessage = async (req, res) => {
    const { threadId, message } = req.body;
    
    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        // Find the thread. If it doesn't exist, we create it.
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // Create a new thread assigned to the current user
            thread = new Thread({
                threadId,
                title: message.substring(0, 50), // Set first message as title (truncated)
                userId: req.userId
            });
            await thread.save();
        } else {
            // If the thread exists, verify ownership BEFORE proceeding
            if (thread.userId.toString() !== req.userId.toString()) {
                return res.status(403).json({ success: false, message: "Access denied" });
            }
        }

        // Save the user's message
        const userMessage = new Message({
            threadId: thread._id,
            role: "user",
            content: message
        });
        await userMessage.save();

        // Get AI Response
        const assistantReply = await getGeminiResponse(message);

        // Save the assistant's message
        const assistantMessage = new Message({
            threadId: thread._id,
            role: "assistant",
            content: assistantReply
        });
        await assistantMessage.save();

        // Update the thread's updatedAt timestamp
        thread.updatedAt = new Date();
        await thread.save();

        res.json({ reply: assistantReply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "something went wrong" });
    }
};
