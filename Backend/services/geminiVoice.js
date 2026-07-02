import "dotenv/config";

/**
 * geminiVoice service
 *
 * Thin wrapper around the Gemini REST API, optimised for voice conversations.
 * Unlike the main chat (which supports markdown, code blocks, long replies),
 * this returns SHORT, CONVERSATIONAL responses suited for audio playback.
 *
 * Design: mirrors utils/gemini.js pattern so the codebase stays consistent.
 * To swap the AI provider, only this file needs to change.
 */

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

/** System prompt that constrains voice replies to be spoken-word friendly */
const VOICE_SYSTEM_PROMPT = `You are Nexora AI, a helpful, friendly, and concise voice assistant.
Rules for voice responses:
- Keep replies SHORT (1-3 sentences max unless the user needs detail).
- Use natural spoken language — no markdown, no bullet points, no code blocks.
- Do NOT use asterisks, hashtags, or formatting symbols.
- Be warm, direct, and conversational.
- If asked to explain something complex, give a brief spoken summary and offer to elaborate.`;

/**
 * Get a voice-optimised AI response from Gemini.
 *
 * @param {string} message  - The transcribed user message
 * @returns {Promise<string>} - Clean spoken-word reply
 */
const getVoiceReply = async (message) => {
    const payload = {
        systemInstruction: {
            parts: [{ text: VOICE_SYSTEM_PROMPT }],
        },
        contents: [
            {
                parts: [{ text: message }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 300,   // keep it concise for voice
            temperature: 0.9,
        },
    };

    try {
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
            console.error("[GeminiVoice] API error:", data.error);

            // Handle rate limiting gracefully
            if (
                data.error?.code === 429 ||
                data.error?.status === "RESOURCE_EXHAUSTED"
            ) {
                return "I'm a bit busy right now. Please try again in a moment.";
            }
            return "Sorry, I couldn't generate a response. Please try again.";
        }

        const reply =
            data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            "I didn't catch that. Could you try again?";

        // Strip any leftover markdown symbols that Gemini occasionally adds
        return reply
            .replace(/[*_`#~]/g, "")
            .replace(/\n{2,}/g, " ")
            .trim();

    } catch (err) {
        console.error("[GeminiVoice] Network error:", err);
        return "Something went wrong. Please check your connection and try again.";
    }
};

export default getVoiceReply;
