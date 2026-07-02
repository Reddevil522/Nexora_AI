import transcribeAudio from "../services/speechToText.js";
import getVoiceReply from "../services/geminiVoice.js";
import synthesizeSpeech from "../services/textToSpeech.js";
import VoiceHistory from "../models/VoiceHistory.js";
import Thread from "../models/Thread.js";
import Message from "../models/Message.js";

/* ─────────────────────────────────────────────────────────────────────────── *
 *  Voice Controller                                                           *
 *  All handlers are exported as named functions.                              *
 *  Route: /api/voice/*  (protected by authMiddleware → req.userId available)  *
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * POST /api/voice/start
 * Signal that a voice session is beginning.
 * Stateless — reserved for future session tracking (e.g. WebSocket upgrade).
 */
export const startSession = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Voice session started" });
    } catch (err) {
        console.error("[Voice] startSession error:", err);
        res.status(500).json({ error: "Failed to start voice session" });
    }
};

/**
 * POST /api/voice/stop
 * Signal that a voice session has ended.
 * Stateless — mirrors startSession for symmetry.
 */
export const stopSession = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "Voice session stopped" });
    } catch (err) {
        console.error("[Voice] stopSession error:", err);
        res.status(500).json({ error: "Failed to stop voice session" });
    }
};

/**
 * POST /api/voice/transcribe
 * Receives multipart/form-data with an "audio" field.
 * Returns: { transcript: string }
 */
export const transcribeAudioHandler = async (req, res) => {
    try {
        // multer populates req.file from the "audio" field
        if (!req.file) {
            return res.status(400).json({ error: "No audio file received" });
        }

        if (req.file.size === 0) {
            return res.status(400).json({ error: "Audio file is empty" });
        }

        const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);

        if (!transcript || transcript.trim().length === 0) {
            return res
                .status(422)
                .json({ error: "Could not transcribe audio — please speak clearly and try again" });
        }

        res.status(200).json({ transcript: transcript.trim() });

    } catch (err) {
        console.error("[Voice] transcribeAudio error:", err);
        res.status(500).json({ error: err.message || "Speech-to-text failed" });
    }
};

/**
 * POST /api/voice/chat
 * Body: { message: string, threadId?: string }
 * Returns: { reply: string }
 * Also saves the exchange to VoiceHistory.
 */
export const voiceChat = async (req, res) => {
    try {
        const { message, threadId } = req.body;

        if (!message || message.trim().length === 0) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Get a voice-optimised Gemini response
        const reply = await getVoiceReply(message.trim());

        // Persist the exchange asynchronously (don't block the response to keep voice fast)
        (async () => {
            try {
                if (!threadId) return; // Need a thread to save into
                
                let thread = await Thread.findOne({ threadId });
                if (!thread) {
                    thread = new Thread({
                        threadId,
                        title: message.trim().substring(0, 50),
                        userId: req.userId
                    });
                    await thread.save();
                } else if (thread.userId.toString() !== req.userId.toString()) {
                    return; // Prevent saving to someone else's thread
                }

                await new Message({
                    threadId: thread._id,
                    role: "user",
                    content: message.trim()
                }).save();

                await new Message({
                    threadId: thread._id,
                    role: "assistant",
                    content: reply
                }).save();

                thread.updatedAt = new Date();
                await thread.save();
            } catch (err) {
                console.error("[Voice] Failed to save to Message history:", err);
            }
        })();

        res.status(200).json({ reply });

    } catch (err) {
        console.error("[Voice] voiceChat error:", err);
        res.status(500).json({ error: err.message || "Voice chat failed" });
    }
};

/**
 * POST /api/voice/speak
 * Body: { text: string }
 * Returns: audio/mpeg stream  — or 204 No Content if TTS is not configured.
 * Frontend plays the stream directly or falls back to SpeechSynthesis on 204.
 */
export const speakText = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: "Text is required" });
        }

        // Truncate extremely long replies before sending to TTS
        const clampedText = text.trim().substring(0, 5000);

        const audioBuffer = await synthesizeSpeech(clampedText);

        if (!audioBuffer) {
            // TTS not configured — signal frontend to use SpeechSynthesis
            return res.status(204).end();
        }

        res.set({
            "Content-Type": "audio/mpeg",
            "Content-Length": audioBuffer.length,
            "Cache-Control": "no-store",
        });

        res.status(200).send(audioBuffer);

    } catch (err) {
        console.error("[Voice] speakText error:", err);
        // Return 204 so frontend gracefully falls back instead of crashing
        res.status(204).end();
    }
};

/**
 * GET /api/voice/history
 * Returns the authenticated user's voice conversation history (newest first).
 * Query params: limit (default 50), skip (default 0) for pagination.
 */
export const getHistory = async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip = parseInt(req.query.skip) || 0;

        const records = await VoiceHistory.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await VoiceHistory.countDocuments({ userId: req.userId });

        res.status(200).json({
            records,
            total,
            limit,
            skip,
        });

    } catch (err) {
        console.error("[Voice] getHistory error:", err);
        res.status(500).json({ error: "Failed to fetch voice history" });
    }
};
