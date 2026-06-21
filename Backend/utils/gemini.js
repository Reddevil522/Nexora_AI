import "dotenv/config";
import { NEXORA_IDENTITY_PROMPT } from "./prompts.js";

const getGeminiResponse = async (message) => {

    const options = {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },

        body: JSON.stringify({
            systemInstruction: {
                parts: [
                    {
                        text: NEXORA_IDENTITY_PROMPT
                    }
                ]
            },
            contents: [
                {
                    parts: [
                        {
                            text: message
                        }
                    ]
                }
            ]
        })
    };

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
            options
        );

        const data = await response.json();

        if (!response.ok || data.error) {
            console.error("Gemini API Error:", data.error);
            if (data.error?.code === 429 || data.error?.status === 'RESOURCE_EXHAUSTED') {
                return "Nexora AI is currently experiencing high traffic and has exceeded its API limit. Please wait a few seconds and try again.";
            }
            return "Nexora AI is experiencing some technical difficulties. Please try again later.";
        }

        return (
            data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response generated"
        );

    } catch (err) {

        console.log(err);

        return "Something went wrong!";
    }
};

export default getGeminiResponse;