import "./Style/ChatWindow.css";
import Chat from "./Chat.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { MyContext } from "../MyContext.jsx";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { ScaleLoader } from "react-spinners";
import { chatService } from "../services/chatService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { handleError } from "../utils/errorHandler.js";

import VoiceButton from "./Voice/VoiceButton.jsx";
import { useVoiceContext, VOICE_STATUS } from "../context/VoiceContext.jsx";
import VoiceStatus from "./Voice/VoiceStatus.jsx";
import VoiceWave from "./Voice/VoiceWave.jsx";

/* ── Icon set (matches Home.jsx style) ── */
const iconProps = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const IconUser = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" /></svg>);
const IconSend = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4 20-7z" /></svg>);
const IconAlert = (p) => (<svg {...iconProps} width={15} height={15} {...p} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16.5h.01" /></svg>);
const IconClose = (p) => (<svg {...iconProps} width={13} height={13} {...p} aria-hidden="true"><path d="M18 6L6 18" /><path d="M6 6l12 12" /></svg>);
const IconMenu = (p) => (<svg {...iconProps} width={20} height={20} {...p} aria-hidden="true"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>);

/* Nexus mark — same signature glyph used on Home */
function NodeMark({ size = 18 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 7L5 17M12 7L19 17M5 17H19" stroke="var(--amber)" strokeWidth="1.1" opacity=".55" />
            <circle cx="12" cy="6" r="2.2" fill="var(--amber)" />
            <circle cx="5" cy="18" r="2.2" fill="var(--amber)" />
            <circle cx="19" cy="18" r="2.2" fill="var(--amber)" />
        </svg>
    );
}

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
        setIsSidebarOpen,
    } = useContext(MyContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const { user } = useAuth();
    const { voiceStatus, voiceError } = useVoiceContext();

    // Send prompt to API and receive reply
    const getReply = useCallback(async () => {
        if (!prompt.trim() || loading) return;

        setLoading(true);
        setError(null);
        setNewChat(false);

        try {
            const res = await chatService.sendMessage({ message: prompt, threadId: currThreadId });
            setReply(res.reply);
        } catch (err) {
            console.error("Chat API error:", err);
            const msg = err.userMessage || handleError(err) || "Unable to generate response. Please try again.";
            setError(msg);
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
                {/* Hamburger — only visible on mobile */}
                <button
                    className="chat-window__hamburger"
                    aria-label="Open sidebar"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <IconMenu />
                </button>

                <div
                    className={`chat-window__brand ${isSidebarOpen
                        ? "chat-window__brand--hidden"
                        : "chat-window__brand--visible"
                        }`}
                    aria-hidden={isSidebarOpen}
                >
                    <div className="chat-window__brand-icon"><NodeMark size={16} /></div>
                    <span className="chat-window__brand-name">Nexora AI</span>
                </div>
                <div className="chat-window__header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div className="chat-window__profile-chip" aria-label="User profile">
                        <div className="chat-window__profile-avatar">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <span className="chat-window__profile-name">{user?.name || "User"}</span>
                    </div>
                </div>
            </header>

            {/* ── Message Area ── */}
            <div className="chat-window__body">
                <Chat text={reply} />

                {error && !loading && (
                    <div className="chat-window__error" role="alert">
                        <IconAlert />
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            aria-label="Dismiss error"
                        >
                            <IconClose />
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
                    {voiceStatus !== VOICE_STATUS.IDLE || voiceError ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <VoiceStatus />
                            <VoiceWave />
                            {voiceError && <span style={{ color: '#ff4d4d', fontSize: '13.5px', marginLeft: 'auto' }}>{voiceError}</span>}
                        </div>
                    ) : (
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
                    )}

                    <VoiceButton />

                    {loading ? (
                        <div className="chat-window__send-loader" aria-label="Sending">
                            <ScaleLoader color="#ff9d4d" height={14} width={2} radius={2} margin={1.5} />
                        </div>
                    ) : (
                        <button
                            className={`chat-window__send-btn ${prompt.trim() ? "chat-window__send-btn--active" : ""
                                }`}
                            onClick={getReply}
                            disabled={!prompt.trim()}
                            aria-label="Send message"
                        >
                            <IconSend width={14} height={14} />
                        </button>
                    )}
                </div>







                <p className="chat-window__disclaimer">
                    Nexora can make mistakes. Check important info.
                </p>
            </footer>
        </div>
    );
}

export default ChatWindow;