import api from "./api.js";

/**
 * voiceApi.js
 *
 * Axios service layer for all /api/voice endpoints.
 * Imports the existing configured `api` instance (JWT interceptor already attached).
 */

/**
 * Signal that a voice session is starting.
 * @returns {Promise<{ success: boolean }>}
 */
export const startVoice = () =>
    api.post("/api/voice/start").then((r) => r.data);

/**
 * Signal that a voice session has ended.
 * @returns {Promise<{ success: boolean }>}
 */
export const stopVoice = () =>
    api.post("/api/voice/stop").then((r) => r.data);

/**
 * Upload an audio Blob and receive its text transcript.
 *
 * @param {Blob} audioBlob         - Raw audio recorded by MediaRecorder
 * @param {string} [mimeType]      - MIME type (default: "audio/webm")
 * @param {AbortSignal} [signal]   - Optional AbortController signal for cancellation
 * @returns {Promise<{ transcript: string }>}
 */
export const transcribe = (audioBlob, mimeType = "audio/webm", signal) => {
    const formData = new FormData();
    // Multer expects the field named "audio"
    formData.append("audio", audioBlob, `recording.${mimeType.split("/")[1] || "webm"}`);

    return api
        .post("/api/voice/transcribe", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            timeout: 30000, // audio upload + Gemini STT can take a moment
            signal,
        })
        .then((r) => r.data);
};

/**
 * Send a transcribed message to Gemini and receive a voice-optimised reply.
 *
 * @param {string} message           - The transcribed user message
 * @param {string} [threadId]        - Optional thread ID for context
 * @param {AbortSignal} [signal]     - Optional AbortController signal
 * @returns {Promise<{ reply: string }>}
 */
export const chat = (message, threadId, signal) =>
    api
        .post("/api/voice/chat", { message, threadId }, { signal })
        .then((r) => r.data);

/**
 * Send AI reply text to the backend for TTS synthesis.
 * Returns an ArrayBuffer containing MP3 audio, or null if TTS is not configured
 * (backend returns 204 No Content).
 *
 * @param {string} text              - Text to synthesize
 * @param {AbortSignal} [signal]     - Optional AbortController signal
 * @returns {Promise<ArrayBuffer|null>}
 */
export const speak = async (text, signal) => {
    const response = await api.post(
        "/api/voice/speak",
        { text },
        {
            responseType: "arraybuffer",
            validateStatus: (s) => s === 200 || s === 204,
            signal,
        }
    );

    // 204 = TTS not configured; return null so frontend falls back to SpeechSynthesis
    if (response.status === 204) return null;

    return response.data; // ArrayBuffer
};

/**
 * Fetch the authenticated user's voice history.
 *
 * @param {number} [limit=50]
 * @param {number} [skip=0]
 * @returns {Promise<{ records: Array, total: number }>}
 */
export const history = (limit = 50, skip = 0) =>
    api.get("/api/voice/history", { params: { limit, skip } }).then((r) => r.data);
