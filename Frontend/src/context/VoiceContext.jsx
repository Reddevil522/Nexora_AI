import { createContext, useContext, useState, useCallback, useRef } from "react";

/**
 * VoiceContext
 *
 * Central state store for the voice chat feature.
 * Provides voice state, modal visibility, and the abort controller ref
 * so any component can cancel in-flight API requests.
 *
 * Voice status state machine:
 *   idle ──► listening ──► thinking ──► speaking ──► idle
 *                  ↑___________________________________|
 */

const VoiceContext = createContext(null);

export const VOICE_STATUS = {
    IDLE: "idle",
    LISTENING: "listening",
    THINKING: "thinking",
    SPEAKING: "speaking",
};

export const VoiceProvider = ({ children }) => {
    // Current state in the voice flow
    const [voiceStatus, setVoiceStatus] = useState(VOICE_STATUS.IDLE);

    // Whether the full-screen voice modal is open
    const [isModalOpen, setIsModalOpen] = useState(false);

    // The transcript received from the last STT call
    const [transcript, setTranscript] = useState("");

    // The AI reply from the last voice chat call
    const [aiReply, setAiReply] = useState("");

    // Error message (if any step in the pipeline fails)
    const [voiceError, setVoiceError] = useState(null);

    // AbortController ref — cancel pending API calls when the session stops
    const abortRef = useRef(null);

    /** Create a fresh AbortController and return its signal */
    const getAbortSignal = useCallback(() => {
        // Cancel any previously pending request
        if (abortRef.current) {
            abortRef.current.abort();
        }
        abortRef.current = new AbortController();
        return abortRef.current.signal;
    }, []);

    /** Cancel all pending voice API requests */
    const cancelPending = useCallback(() => {
        if (abortRef.current) {
            abortRef.current.abort();
            abortRef.current = null;
        }
    }, []);

    const openVoiceModal = useCallback(() => {
        setVoiceError(null);
        setTranscript("");
        setAiReply("");
        setVoiceStatus(VOICE_STATUS.IDLE);
        setIsModalOpen(true);
    }, []);

    const closeVoiceModal = useCallback(() => {
        cancelPending();
        setIsModalOpen(false);
        setVoiceStatus(VOICE_STATUS.IDLE);
    }, [cancelPending]);

    const value = {
        voiceStatus,
        setVoiceStatus,
        isModalOpen,
        openVoiceModal,
        closeVoiceModal,
        transcript,
        setTranscript,
        aiReply,
        setAiReply,
        voiceError,
        setVoiceError,
        getAbortSignal,
        cancelPending,
    };

    return (
        <VoiceContext.Provider value={value}>
            {children}
        </VoiceContext.Provider>
    );
};

/**
 * useVoiceContext — hook to consume the VoiceContext.
 * Throws if used outside <VoiceProvider>.
 */
export const useVoiceContext = () => {
    const ctx = useContext(VoiceContext);
    if (!ctx) {
        throw new Error("useVoiceContext must be used within a VoiceProvider");
    }
    return ctx;
};

export default VoiceContext;
