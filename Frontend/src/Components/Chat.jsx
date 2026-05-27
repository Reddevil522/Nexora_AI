import "./Style/Chat.css";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../MyContext.jsx";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

/* ── Copy-to-clipboard button for code blocks ── */
function CopyButton({ code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* clipboard unavailable — fail silently */
        }
    };

    return (
        <button
            className="chat__copy-btn"
            onClick={handleCopy}
            aria-label={copied ? "Copied!" : "Copy code"}
        >
            {copied ? (
                <i className="fa-solid fa-check" aria-hidden="true" />
            ) : (
                <i className="fa-regular fa-copy" aria-hidden="true" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
        </button>
    );
}

/* ── Code block renderer with copy button ── */
function CodeBlock({ children, className }) {
    const code = String(children).replace(/\n$/, "");
    return (
        <div className="chat__code-block">
            <div className="chat__code-header">
                <span className="chat__code-lang">
                    {className?.replace("language-", "") || "code"}
                </span>
                <CopyButton code={code} />
            </div>
            <code className={className}>{children}</code>
        </div>
    );
}

/* ── Markdown renderer config — reused for all AI messages ── */
const markdownComponents = {
    pre: ({ children }) => <pre className="chat__pre">{children}</pre>,
    code: ({ node, inline, className, children, ...props }) =>
        inline ? (
            <code className="chat__inline-code" {...props}>{children}</code>
        ) : (
            <CodeBlock className={className}>{children}</CodeBlock>
        ),
};

/* ── Empty / welcome state ── */
function EmptyState() {
    return (
        <div className="chat__empty-state">
            <div className="chat__empty-icon" aria-hidden="true">✦</div>
            <h2 className="chat__empty-title">How can I help you today?</h2>
            <p className="chat__empty-subtitle">
                Ask me anything — I'm here to help.
            </p>
        </div>
    );
}

function Chat() {
    const { newChat, prevChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const bottomRef = useRef(null);

    // Word-by-word typewriter animation for latest AI reply
    useEffect(() => {
        if (!reply) {
            setLatestReply(null);
            return;
        }

        setLatestReply("");

        const words = reply.split(" ");
        let index = 0;

        const interval = setInterval(() => {
            setLatestReply((prev) => {
                return prev + (index === 0 ? "" : " ") + words[index];
            });

            index++;

            if (index >= words.length) {
                clearInterval(interval);
            }
        }, 40); // typing speed

        return () => clearInterval(interval);
    }, [reply]);

    // Auto-scroll to bottom whenever messages or animation updates
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [prevChats, latestReply]);

    // All messages except the last (which is handled separately for animation)
    const historicalChats = prevChats?.slice(0, -2) ?? [];

    // The last user message and last AI message, handled separately
    const lastUserMsg =
        prevChats?.length >= 2 ? prevChats[prevChats.length - 2] : null;
    const lastAiMsg =
        prevChats?.length >= 1 ? prevChats[prevChats.length - 1] : null;

    const hasChats = prevChats?.length > 0;

    return (
        <div className="chat">
            {/* ── Empty / New Chat State ── */}
            {(newChat || !hasChats) && <EmptyState />}

            {/* ── Message List ── */}
            <div className="chat__messages">
                {/* Historical messages (all but the last exchange) */}
                {historicalChats.map((chat, idx) => (
                    <MessageBubble key={`hist-${idx}`} chat={chat} />
                ))}

                {/* Last user message */}
                {lastUserMsg?.role === "user" && (
                    <MessageBubble key="last-user" chat={lastUserMsg} />
                )}

                {/* Last AI message — animated if actively streaming, static if loaded from history */}
                {hasChats && lastAiMsg?.role === "assistant" && (
                    <div className="chat__row chat__row--ai">
                        <div className="chat__avatar" aria-hidden="true">N</div>
                        <div className="chat__bubble chat__bubble--ai">
                            <ReactMarkdown
                                rehypePlugins={[rehypeHighlight]}
                                components={markdownComponents}
                            >
                                {latestReply !== null
                                    ? latestReply
                                    : lastAiMsg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                {/* Scroll anchor */}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}

/* ── Single message bubble — user or AI ── */
function MessageBubble({ chat }) {
    const isUser = chat.role === "user";

    if (isUser) {
        return (
            <div className="chat__row chat__row--user">
                <p className="chat__bubble chat__bubble--user">{chat.content}</p>
            </div>
        );
    }

    return (
        <div className="chat__row chat__row--ai">
            <div className="chat__avatar" aria-hidden="true">N</div>
            <div className="chat__bubble chat__bubble--ai">
                <ReactMarkdown
                    rehypePlugins={[rehypeHighlight]}
                    components={markdownComponents}
                >
                    {chat.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default Chat;