import './App.css';
import ChatWindow from './Components/ChatWindow.jsx';
import Sidebar from './Components/Sidebar.jsx';
import { MyContext } from "./MyContext.jsx";
import { useState, useMemo } from "react";
import { v1 as uuidv1 } from "uuid";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  // Sidebar open/closed state — shared via context so both
  // Sidebar and ChatWindow can read and toggle it
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoize context value to prevent unnecessary re-renders
  // of all consumers when App re-renders for unrelated reasons
  const providerValues = useMemo(() => ({
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen,
  }), [
    prompt, reply, currThreadId,
    newChat, prevChats, allThreads,
    isSidebarOpen,
  ]);

  return (
    <MyContext.Provider value={providerValues}>
      <div className="app">
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContext.Provider>
  );
}

export default App;