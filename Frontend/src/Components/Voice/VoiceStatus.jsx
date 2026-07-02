import { useVoiceContext, VOICE_STATUS } from "../../context/VoiceContext.jsx";

/**
 * VoiceStatus
 * 
 * Displays the current state of the voice engine with animated dots.
 */
const VoiceStatus = () => {
    const { voiceStatus } = useVoiceContext();

    const getStatusText = () => {
        switch (voiceStatus) {
            case VOICE_STATUS.LISTENING:
                return <>Listening<span>.</span><span>.</span><span>.</span></>;
            case VOICE_STATUS.THINKING:
                return <>Thinking<span>.</span><span>.</span><span>.</span></>;
            case VOICE_STATUS.SPEAKING:
                return <>Speaking<span>.</span><span>.</span><span>.</span></>;
            case VOICE_STATUS.IDLE:
            default:
                return "Tap to speak";
        }
    };

    return (
        <div className="voice-status">
            {getStatusText()}
        </div>
    );
};

export default VoiceStatus;
