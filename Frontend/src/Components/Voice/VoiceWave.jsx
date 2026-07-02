import { useVoiceContext, VOICE_STATUS } from "../../context/VoiceContext.jsx";

/**
 * VoiceWave
 * 
 * Animated equalizer bars shown when the AI is speaking.
 */
const VoiceWave = () => {
    const { voiceStatus } = useVoiceContext();

    // Only show wave if AI is speaking
    if (voiceStatus !== VOICE_STATUS.SPEAKING) return null;

    return (
        <div className="voice-wave">
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
            <div className="voice-wave-bar"></div>
        </div>
    );
};

export default VoiceWave;
