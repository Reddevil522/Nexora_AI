import { useRef, useState, useCallback, useEffect } from "react";

/**
 * useRecorder
 *
 * Manages the browser's MediaRecorder API.
 * Handles requesting microphone permissions, capturing audio chunks,
 * and returning the final audio Blob when recording stops.
 */
const useRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const streamRef = useRef(null);

    // Get the supported mime type (prefers webm on Chrome/Firefox, mp4 on Safari)
    const getMimeType = () => {
        const types = ["audio/webm", "audio/mp4", "audio/ogg", "audio/wav"];
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) return type;
        }
        return "audio/webm"; // fallback
    };

    const startRecording = useCallback(async () => {
        try {
            audioChunksRef.current = [];
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const mimeType = getMimeType();
            const mediaRecorder = new MediaRecorder(stream, { mimeType });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.start(100); // collect 100ms chunks
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone access denied or error:", err);
            throw new Error("Microphone access is required to use Voice Chat.");
        }
    }, []);

    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current) {
                resolve(null);
                return;
            }

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, {
                    type: mediaRecorderRef.current.mimeType,
                });
                
                // Stop all tracks to release the microphone (stops the red dot in browser tab)
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                    streamRef.current = null;
                }
                
                setIsRecording(false);
                mediaRecorderRef.current = null;
                resolve(blob);
            };

            mediaRecorderRef.current.stop();
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    return {
        isRecording,
        startRecording,
        stopRecording,
    };
};

export default useRecorder;
