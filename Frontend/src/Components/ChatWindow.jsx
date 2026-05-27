import "./Style/ChatWindow.css";
import logochat from "../assets/logo.png";
import Chat from "./Chat.jsx";
import { MyContext } from "../MyContext.jsx";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
    const {
        prompt,
        setPrompt,
        reply,
        setReply,
        currThreadId,
        prevChats,
        setPrevChats,
        setNewChat,
        isSidebarOpen,
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    // Send prompt to API and receive reply
    const getReply = useCallback(async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setError(null);
        setNewChat(false);

        try {
            const response = await fetch("http://localhost:8080/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: prompt, threadId: currThreadId }),
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const res = await response.json();
            setReply(res.reply);
        } catch (err) {
            console.error("Chat API error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [prompt, loading, currThreadId, setNewChat, setReply]);

    // Append the completed exchange to chat history once reply arrives
    useEffect(() => {
        if (prompt && reply) {
            setPrevChats((prev) => [
                ...prev,
                { role: "user", content: prompt },
                { role: "assistant", content: reply },
            ]);
        }
        setPrompt("");
    }, [reply]); // eslint-disable-line react-hooks/exhaustive-deps

    // Re-focus input after response arrives
    useEffect(() => {
        if (!loading) inputRef.current?.focus();
    }, [loading]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            getReply();
        }
    };

    return (
        <div className="chat-window">
            {/* ── Top Bar ── */}
            <header className="chat-window__header">
                {/* Logo fades in when sidebar is collapsed (icon-rail mode) */}
                <img
                    src={logochat}
                    alt="Nexora AI"
                    className={`chat-window__logo ${isSidebarOpen
                            ? "chat-window__logo--hidden"
                            : "chat-window__logo--visible"
                        }`}
                    aria-hidden={isSidebarOpen}
                />

                <button
                    className="chat-window__profile-btn"
                    aria-label="User profile"
                >
                    <i className="fa-solid fa-user" aria-hidden="true" />
                </button>
            </header>

            {/* ── Message Area ── */}
            <div className="chat-window__body">
                <Chat text={reply} />

                {loading && (
                    <div
                        className="chat-window__loading"
                        aria-live="polite"
                        aria-label="Generating response"
                    >
                        <ScaleLoader
                            color="#6b6b6b"
                            height={16}
                            width={2}
                            radius={2}
                            margin={2}
                        />
                    </div>
                )}

                {error && !loading && (
                    <div className="chat-window__error" role="alert">
                        <i
                            className="fa-solid fa-circle-exclamation"
                            aria-hidden="true"
                        />
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            aria-label="Dismiss error"
                        >
                            <i className="fa-solid fa-xmark" aria-hidden="true" />
                        </button>
                    </div>
                )}
            </div>

            {/* ── Input Area ── */}
            <footer className="chat-window__input-area">
                <div
                    className={`chat-window__input-box ${loading ? "chat-window__input-box--disabled" : ""
                        }`}
                >
                    <input
                        ref={inputRef}
                        className="chat-window__input"
                        placeholder="Ask anything…"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                        aria-label="Chat input"
                        autoComplete="off"
                    />
                    <button
                        className={`chat-window__send-btn ${prompt.trim() && !loading
                                ? "chat-window__send-btn--active"
                                : ""
                            }`}
                        onClick={getReply}
                        disabled={!prompt.trim() || loading}
                        aria-label="Send message"
                    >
                        <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                    </button>
                </div>
                <p className="chat-window__disclaimer">
                    Nexora can make mistakes. Check important info.
                </p>
            </footer>
        </div>
    );
}

export default ChatWindow;