import { useState, useRef, useCallback, useEffect } from "react";

/**
 * useSpeech
 *
 * Manages audio playback for TTS.
 * Plays the backend MP3 ArrayBuffer if available.
 * Gracefully falls back to browser SpeechSynthesis API if backend TTS is unavailable.
 */
const useSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const audioRef = useRef(new Audio());
    const synthRef = useRef(window.speechSynthesis);

    // Callbacks for external state tracking (passed by useVoice)
    const onStartRef = useRef(null);
    const onEndRef = useRef(null);

    // Setup native audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        
        const handleEnded = () => {
            setIsSpeaking(false);
            if (onEndRef.current) onEndRef.current();
        };

        const handlePlay = () => {
            setIsSpeaking(true);
            if (onStartRef.current) onStartRef.current();
        };

        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("play", handlePlay);

        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("play", handlePlay);
            audio.pause();
            audio.src = ""; // cleanup
        };
    }, []);

    /**
     * Stop any current speech (audio element or SpeechSynthesis)
     */
    const stopSpeech = useCallback(() => {
        // Stop audio element
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        
        // Stop browser synth
        if (synthRef.current.speaking) {
            synthRef.current.cancel();
        }
        
        setIsSpeaking(false);
    }, []);

    /**
     * Play TTS.
     * 
     * @param {ArrayBuffer|null} audioBuffer - MP3 buffer from backend (null if unconfigured)
     * @param {string} fallbackText          - Text to speak if buffer is null
     * @param {function} onStart             - Callback when speech starts
     * @param {function} onEnd               - Callback when speech ends
     */
    const speakText = useCallback((audioBuffer, fallbackText, onStart, onEnd) => {
        stopSpeech();
        
        onStartRef.current = onStart;
        onEndRef.current = onEnd;

        if (audioBuffer) {
            // We have real TTS audio from backend
            try {
                const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
                const url = URL.createObjectURL(blob);
                
                audioRef.current.src = url;
                audioRef.current.play().catch(e => {
                    console.error("Audio play failed:", e);
                    // If audio play is blocked by browser, try fallback
                    fallbackToBrowserSynth(fallbackText);
                });
                
                // Cleanup URL after playing
                audioRef.current.onended = () => {
                    setIsSpeaking(false);
                    URL.revokeObjectURL(url);
                    if (onEndRef.current) onEndRef.current();
                };
            } catch (err) {
                console.error("Failed to play audio buffer:", err);
                fallbackToBrowserSynth(fallbackText);
            }
        } else {
            // TTS not configured on backend, use browser fallback
            fallbackToBrowserSynth(fallbackText);
        }
    }, [stopSpeech]);

    const fallbackToBrowserSynth = (text) => {
        if (!text || !synthRef.current) return;
        
        console.log("Using browser SpeechSynthesis fallback");
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
            setIsSpeaking(true);
            if (onStartRef.current) onStartRef.current();
        };
        
        utterance.onend = () => {
            setIsSpeaking(false);
            if (onEndRef.current) onEndRef.current();
        };
        
        utterance.onerror = (e) => {
            console.error("SpeechSynthesis error:", e);
            setIsSpeaking(false);
            if (onEndRef.current) onEndRef.current(); // end anyway to not get stuck
        };

        // Optional: try to find a nice female voice
        const voices = synthRef.current.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Female") || v.name.includes("Samantha"));
        if (preferredVoice) utterance.voice = preferredVoice;

        synthRef.current.speak(utterance);
    };

    return {
        isSpeaking,
        speakText,
        stopSpeech
    };
};

export default useSpeech;
