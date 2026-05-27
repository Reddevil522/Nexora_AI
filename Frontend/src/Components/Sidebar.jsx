import "./Style/Sidebar.css";
import logo from "../assets/logo.png";
import { useContext, useEffect, useState, useCallback } from "react";
import { MyContext } from "../MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

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

    // Fetch all thread summaries from API
    const getAllThreads = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            const filteredData = res.map((thread) => ({
                threadId: thread.threadId,
                title: thread.title,
            }));
            setAllThreads(filteredData);
        } catch (err) {
            console.error("Failed to fetch threads:", err);
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

    // Load an existing thread's messages
    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(
                `http://localhost:8080/api/thread/${newThreadId}`
            );
            const res = await response.json();
            setPrevChats(res);
            setNewChat(false);
            setReply(null);
        } catch (err) {
            console.error("Failed to load thread:", err);
        }
        // Auto-close sidebar on mobile after selecting a thread
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    };

    // Delete a thread and reset UI if it was the active one
    const deleteThread = async (e, threadId) => {
        e.stopPropagation();
        setDeletingId(threadId);
        try {
            await fetch(`http://localhost:8080/api/thread/${threadId}`, {
                method: "DELETE",
            });
            setAllThreads((prev) =>
                prev.filter((thread) => thread.threadId !== threadId)
            );
            if (threadId === currThreadId) createNewChat();
        } catch (err) {
            console.error("Failed to delete thread:", err);
        } finally {
            setDeletingId(null);
        }
    };

    const toggle = () => setIsSidebarOpen((prev) => !prev);

    return (
        <>
            {/* Mobile backdrop — only on small screens when open */}
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
                {/* ════════════════════════════
                    HEADER
                    Open:      logo + collapse btn
                    Collapsed: toggle btn only (centered)
                ════════════════════════════ */}
                <div className="sidebar__header">
                    {/* Logo — hidden when collapsed */}
                    <img
                        src={logo}
                        alt="Nexora AI"
                        className="sidebar__logo sidebar__hide-when-collapsed"
                    />

                    {/* Toggle / collapse button — always visible */}
                    <button
                        className="sidebar__icon-btn"
                        onClick={toggle}
                        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        <i className="fa-solid fa-bars" aria-hidden="true" />
                    </button>
                </div>

                {/* ════════════════════════════
                    ACTIONS — New Chat / Search
                    Open:      icon + label
                    Collapsed: icon only (centered), tooltip on hover
                ════════════════════════════ */}
                <div className="sidebar__actions">
                    <button
                        className="sidebar__action-btn"
                        onClick={createNewChat}
                        title="New chat"
                        aria-label="New chat"
                    >
                        <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
                        <span className="sidebar__hide-when-collapsed">New chat</span>
                    </button>

                    <button
                        className="sidebar__action-btn"
                        title="Search chats"
                        aria-label="Search chats"
                    >
                        <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
                        <span className="sidebar__hide-when-collapsed">Search chats</span>
                    </button>
                </div>

                {/* ════════════════════════════
                    THREAD HISTORY
                    Hidden entirely when collapsed
                ════════════════════════════ */}
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
                                        <i className="fa-solid fa-trash" aria-hidden="true" />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* ════════════════════════════
                    FOOTER — Avatar
                    Open:      avatar + label
                    Collapsed: avatar only (centered)
                ════════════════════════════ */}
                <div className="sidebar__footer">
                    <button
                        className="sidebar__footer-btn"
                        aria-label="User profile"
                        title="My Account"
                    >
                        <div className="sidebar__avatar" aria-hidden="true">N</div>
                        <span className="sidebar__hide-when-collapsed">My Account</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;