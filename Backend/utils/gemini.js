import "dotenv/config";

const getGeminiResponse = async (message) => {

    const options = {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },

        body: JSON.stringify({
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

        console.log(data);

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