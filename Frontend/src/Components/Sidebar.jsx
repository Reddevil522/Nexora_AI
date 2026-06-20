import "./Style/Sidebar.css";
import { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../MyContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { threadService } from "../services/threadService.js";
import { v1 as uuidv1 } from "uuid";
import { toastSuccess, toastError } from "../utils/toast.js";
import { handleError } from "../utils/errorHandler.js";

/* ── Icon set (matches Home.jsx style: stroke-based, no external deps) ── */
const iconProps = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

const IconBars = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></svg>);
const IconPen = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M11 4H5a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-6" /><path d="M18.4 2.6a2 2 0 0 1 2.8 2.8L11 15.6l-4 1 1-4 10.4-10z" /></svg>);
const IconSearch = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.4-4.4" /></svg>);
const IconTrash = (p) => (<svg {...iconProps} width={13} height={13} {...p} aria-hidden="true"><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" /></svg>);
const IconLogout = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>);
const IconSun = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>);
const IconMoon = (p) => (<svg {...iconProps} {...p} aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>);

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

function Sidebar() {
    const {
        allThreads,
        setAllThreads,
        currThreadId,
        setNewChat,
        setPrompt,
        setReply,
        setCurrThreadId,
        setPrevChats,
        isSidebarOpen,
        setIsSidebarOpen,
    } = useContext(MyContext);

    const [isLoading, setIsLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const getAllThreads = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await threadService.getThreads();
            const filteredData = res.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title,
            }));
            setAllThreads(filteredData);
        } catch (err) {
            console.error("Failed to fetch threads:", err);
            toastError(err.userMessage || handleError(err) || "Unable to load conversations.");
        } finally {
            setIsLoading(false);
        }
    }, [setAllThreads]);

    useEffect(() => {
        getAllThreads();
    }, [currThreadId, getAllThreads]);

    // Reset UI to a fresh chat state
    const createNewChat = useCallback(() => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }, [setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats]);

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const res = await threadService.getThread(newThreadId);
            setPrevChats(res.messages);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.error("Failed to load thread:", err);
            toastError(err.userMessage || handleError(err) || "Unable to load chat history.");
        }
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    };

    const deleteThread = async (e, threadId) => {
        e.stopPropagation();
        setDeletingId(threadId);
        try {
            await threadService.deleteThread(threadId);
            setAllThreads((prev) =>
                prev.filter((thread) => thread.threadId !== threadId)
            );
            if (threadId === currThreadId) createNewChat();
            toastSuccess("Conversation deleted successfully.");
        } catch (err) {
            console.error("Failed to delete thread:", err);
            toastError(err.userMessage || handleError(err) || "Unable to delete conversation.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/home");
    };

    const toggle = () => setIsSidebarOpen((prev) => !prev);

    return (
        <>
            {isSidebarOpen && (
                <div
                    className="sidebar__backdrop"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`sidebar ${isSidebarOpen ? "sidebar--open" : "sidebar--collapsed"}`}
                aria-label="Navigation sidebar"
            >
                {/* HEADER */}
                <div className="sidebar__header">
                    <div className="sidebar__brand sidebar__hide-when-collapsed">
                        <div className="sidebar__brand-icon"><NodeMark size={16} /></div>
                        <span className="sidebar__brand-name">Nexora AI</span>
                    </div>
                    <button
                        className="sidebar__icon-btn"
                        onClick={toggle}
                        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <IconBars />
                    </button>
                </div>

                {/* ACTIONS */}
                <div className="sidebar__actions">
                    <button
                        className="sidebar__action-btn"
                        onClick={createNewChat}
                        title="New chat"
                        aria-label="New chat"
                    >
                        <IconPen />
                        <span className="sidebar__hide-when-collapsed">New chat</span>
                    </button>
                    <button
                        className="sidebar__action-btn"
                        title="Search chats"
                        aria-label="Search chats"
                    >
                        <IconSearch />
                        <span className="sidebar__hide-when-collapsed">Search chats</span>
                    </button>
                    <button
                        className="sidebar__action-btn"
                        onClick={toggleTheme}
                        title={theme === "dark" ? "Light mode" : "Dark mode"}
                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {theme === "dark" ? <IconMoon /> : <IconSun />}
                        <span className="sidebar__hide-when-collapsed">Toggle theme</span>
                    </button>
                </div>

                {/* THREAD HISTORY */}
                <div className="sidebar__history sidebar__hide-when-collapsed">
                    <p className="sidebar__section-label">Recents</p>

                    {isLoading ? (
                        <ul className="sidebar__thread-list">
                            {[...Array(4)].map((_, i) => (
                                <li key={i} className="sidebar__thread-skeleton" />
                            ))}
                        </ul>
                    ) : allThreads?.length === 0 ? (
                        <p className="sidebar__empty-state">No conversations yet</p>
                    ) : (
                        <ul className="sidebar__thread-list">
                            {allThreads?.map((thread) => (
                                <li
                                    key={thread.threadId}
                                    className={`sidebar__thread-item ${thread.threadId === currThreadId
                                        ? "sidebar__thread-item--active"
                                        : ""
                                        } ${deletingId === thread.threadId
                                            ? "sidebar__thread-item--deleting"
                                            : ""
                                        }`}
                                    onClick={() => changeThread(thread.threadId)}
                                    title={thread.title}
                                >
                                    <span className="sidebar__thread-title">
                                        {thread.title}
                                    </span>
                                    <button
                                        className="sidebar__delete-btn"
                                        aria-label={`Delete "${thread.title}"`}
                                        onClick={(e) => deleteThread(e, thread.threadId)}
                                    >
                                        <IconTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* FOOTER */}
                <div className="sidebar__footer">
                    <button
                        className="sidebar__footer-btn"
                        aria-label="Logout"
                        title="Logout"
                        onClick={handleLogout}
                    >
                        <div className="sidebar__avatar" aria-hidden="true">
                            {user?.name ? user.name.charAt(0).toUpperCase() : "N"}
                        </div>
                        <span className="sidebar__hide-when-collapsed sidebar__footer-label">
                            <span className="sidebar__footer-user">
                                <span className="sidebar__footer-name">{user?.name || "User"}</span>
                                <span className="sidebar__footer-hint">Sign out</span>
                            </span>
                            <IconLogout width={14} height={14} />
                        </span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;