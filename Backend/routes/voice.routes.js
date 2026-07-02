import { Router } from "express";
import upload, { handleUploadError } from "../middleware/uploadAudio.js";
import {
    startSession,
    stopSession,
    transcribeAudioHandler,
    voiceChat,
    speakText,
    getHistory,
} from "../controllers/voice.controller.js";

/**
 * Voice Routes
 * Base: /api/voice  (all protected by authMiddleware in server.js)
 */
const router = Router();

// ── Session control ──────────────────────────────────────────────────────────
router.post("/start", startSession);
router.post("/stop", stopSession);

// ── STT: multipart audio upload → transcript ─────────────────────────────────
// upload.single("audio") handles the "audio" field from FormData.
// handleUploadError converts multer errors to JSON responses.
router.post(
    "/transcribe",
    upload.single("audio"),
    handleUploadError,
    transcribeAudioHandler
);

// ── AI chat with voice-optimised reply ──────────────────────────────────────
router.post("/chat", voiceChat);

// ── TTS: text → MP3 audio buffer ─────────────────────────────────────────────
router.post("/speak", speakText);

// ── Voice history ────────────────────────────────────────────────────────────
router.get("/history", getHistory);

export default router;
