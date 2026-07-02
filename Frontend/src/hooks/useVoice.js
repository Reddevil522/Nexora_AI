import { useCallback, useContext } from "react";
import { useVoiceContext, VOICE_STATUS } from "../context/VoiceContext.jsx";
import { MyContext } from "../MyContext.jsx";
import useRecorder from "./useRecorder.js";
import useSpeech from "./useSpeech.js";
import { startVoice, stopVoice, transcribe, chat, speak } from "../services/voiceApi.js";

/**
 * useVoice orchestration hook.
 *
 * Combines useRecorder, useSpeech, and voiceApi into a single cohesive
 * Full Duplex Voice flow. Manages all state transitions.
 */
const useVoice = () => {
    const {
        voiceStatus,
        setVoiceStatus,
        setTranscript,
        setAiReply,
        setVoiceError,
        getAbortSignal,
        cancelPending
    } = useVoiceContext();

    const { currThreadId, setPrevChats } = useContext(MyContext);
    
    const { isRecording, startRecording, stopRecording } = useRecorder();
    const { isSpeaking, speakText, stopSpeech } = useSpeech();

    const handleError = useCallback((err, step) => {
        // Ignore aborted requests (happens when user closes modal early)
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        
        console.error(`Voice error at ${step}:`, err);
        setVoiceError(err.userMessage || err.message || "An error occurred. Please try again.");
        setVoiceStatus(VOICE_STATUS.IDLE);
    }, [setVoiceError, setVoiceStatus]);

    /**
     * Start the recording phase.
     */
    const handleStartRecording = useCallback(async () => {
        try {
            setVoiceError(null);
            setTranscript("");
            setAiReply("");
            cancelPending(); // cancel any previous speaking/api calls
            stopSpeech();

            await startRecording();
            setVoiceStatus(VOICE_STATUS.LISTENING);
            
            // Notify backend a session started (fire & forget)
            startVoice().catch(e => console.warn("Failed to notify backend start:", e));

        } catch (err) {
            handleError(err, "startRecording");
        }
    }, [startRecording, setVoiceStatus, setVoiceError, setTranscript, setAiReply, cancelPending, stopSpeech, handleError]);

    /**
     * Stop recording and process the pipeline:
     * STT -> Chat -> TTS
     */
    const handleStopRecording = useCallback(async () => {
        try {
            const blob = await stopRecording();
            if (!blob) {
                setVoiceStatus(VOICE_STATUS.IDLE);
                return;
            }

            if (blob.size < 1000) {
                // Too short, probably an accidental click
                setVoiceStatus(VOICE_STATUS.IDLE);
                return;
            }

            setVoiceStatus(VOICE_STATUS.THINKING);
            const signal = getAbortSignal();

            // 1. Transcribe Audio
            const { transcript } = await transcribe(blob, blob.type, signal);
            setTranscript(transcript);

            // 2. Get AI Reply
            const { reply } = await chat(transcript, currThreadId, signal);
            setAiReply(reply);

            // Print the conversation into the main ChatWindow immediately
            setPrevChats(prev => [
                ...prev,
                { role: "user", content: transcript },
                { role: "assistant", content: reply }
            ]);

            // 3. Synthesize Speech
            const audioBuffer = await speak(reply, signal);

            // 4. Play Audio (changes status to SPEAKING internally via callbacks)
            speakText(
                audioBuffer, 
                reply, 
                () => setVoiceStatus(VOICE_STATUS.SPEAKING), // onStart
                () => setVoiceStatus(VOICE_STATUS.IDLE)      // onEnd
            );

        } catch (err) {
            handleError(err, "pipeline");
        }
    }, [stopRecording, setVoiceStatus, getAbortSignal, currThreadId, setTranscript, setAiReply, speakText, handleError]);

    /**
     * Terminate the entire voice session early (e.g. modal closed)
     */
    const terminateSession = useCallback(() => {
        if (isRecording) {
            stopRecording().catch(() => {});
        }
        cancelPending();
        stopSpeech();
        
        // Notify backend (fire & forget)
        stopVoice().catch(e => console.warn("Failed to notify backend stop:", e));
        
        setVoiceStatus(VOICE_STATUS.IDLE);
    }, [isRecording, stopRecording, cancelPending, stopSpeech, setVoiceStatus]);

    return {
        voiceStatus,
        isRecording,
        isSpeaking,
        handleStartRecording,
        handleStopRecording,
        terminateSession
    };
};

export default useVoice;
