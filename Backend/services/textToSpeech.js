import "dotenv/config";

/**
 * textToSpeech service
 *
 * Converts a text string to an MP3 audio Buffer using the
 * Google Cloud Text-to-Speech REST API.
 *
 * Requirements:
 *  - Set GOOGLE_TTS_API_KEY in .env (Google Cloud key with TTS API enabled)
 *
 * Fallback behaviour:
 *  - If GOOGLE_TTS_API_KEY is not set, returns null.
 *  - The controller will send a 204 (No Content) response.
 *  - The frontend will then fall back to browser SpeechSynthesis.
 *
 * Future-proof:
 *  - This service is the ONLY file to change when swapping TTS providers
 *    (e.g. ElevenLabs, Azure Cognitive Services, OpenAI TTS).
 */

const TTS_API_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

/**
 * Synthesize speech from text.
 *
 * @param {string} text          - The text to convert to speech
 * @param {string} languageCode  - BCP-47 language code (default: "en-US")
 * @param {string} voiceName     - Google TTS voice name (default: Wavenet female)
 * @returns {Promise<Buffer|null>} - MP3 audio buffer, or null if TTS is unconfigured
 */
const synthesizeSpeech = async (
    text,
    languageCode = "en-US",
    voiceName = "en-US-Wavenet-F"
) => {
    const apiKey = process.env.GOOGLE_TTS_API_KEY;

    // Gracefully degrade — no key means no TTS, frontend uses SpeechSynthesis
    if (!apiKey) {
        console.warn("[TTS] GOOGLE_TTS_API_KEY not set — skipping server-side TTS.");
        return null;
    }

    const payload = {
        input: { text },
        voice: {
            languageCode,
            name: voiceName,
            ssmlGender: "FEMALE",
        },
        audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 1.0,  // 0.25 – 4.0
            pitch: 0,           // -20 – 20 semitones
        },
    };

    const response = await fetch(`${TTS_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
        console.error("[TTS] Google TTS error:", data.error);
        throw new Error(data.error?.message || "Text-to-speech synthesis failed");
    }

    // Google TTS returns base64-encoded MP3 audio content
    const audioBuffer = Buffer.from(data.audioContent, "base64");
    return audioBuffer;
};

export default synthesizeSpeech;
