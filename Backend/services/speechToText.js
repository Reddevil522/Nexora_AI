import "dotenv/config";

/**
 * speechToText service
 *
 * Converts an audio Buffer to a text transcript using the
 * Gemini 2.5 Flash multimodal API (same key already used for chat).
 *
 * Why Gemini for STT?
 *  - Zero additional API keys — uses the existing GEMINI_API_KEY.
 *  - Gemini 2.5 Flash natively accepts inline audio (base64 encoded).
 *  - The service layer makes swapping to Whisper / AssemblyAI trivial.
 *
 * Supported audio MIME types sent by MediaRecorder:
 *   audio/webm, audio/ogg, audio/mp4, audio/wav
 */

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/**
 * Transcribe an audio Buffer to text.
 *
 * @param {Buffer} audioBuffer  - Raw audio data from multer memoryStorage
 * @param {string} mimeType     - MIME type of the audio (e.g. "audio/webm")
 * @returns {Promise<string>}   - Transcript string, or throws on failure
 */
const transcribeAudio = async (audioBuffer, mimeType = "audio/webm") => {
    // Convert Buffer to base64 string for Gemini inline data
    const base64Audio = audioBuffer.toString("base64");

    const payload = {
        contents: [
            {
                parts: [
                    {
                        // Gemini reads the audio directly from inline_data
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Audio,
                        },
                    },
                    {
                        // Instruction to extract only the spoken words
                        text: "Transcribe the speech in this audio recording. Return ONLY the transcribed text, no explanations, no formatting, no punctuation beyond what was spoken.",
                    },
                ],
            },
        ],
    };

    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        console.error("[STT] Gemini API error:", data.error);
        throw new Error(data.error?.message || "Speech-to-text failed");
    }

    const transcript = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!transcript) {
        throw new Error("No transcript returned from Gemini");
    }

    return transcript;
};

export default transcribeAudio;
