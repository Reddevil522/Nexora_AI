import { MdKeyboardVoice, MdStop } from "react-icons/md";
import { useVoiceContext, VOICE_STATUS } from "../../context/VoiceContext.jsx";
import useVoice from "../../hooks/useVoice.js";

/**
 * VoiceButton
 * 
 * Replaces the placeholder mic icon in the ChatWindow input bar.
 * Toggles voice recording directly without opening a modal.
 */
const VoiceButton = () => {
    const { voiceStatus } = useVoiceContext();
    const { isRecording, handleStartRecording, handleStopRecording } = useVoice();

    const isDisabled = voiceStatus === VOICE_STATUS.THINKING || voiceStatus === VOICE_STATUS.SPEAKING;

    const toggleRecording = () => {
        if (isDisabled) return;
        if (isRecording) {
            handleStopRecording();
        } else {
            handleStartRecording();
        }
    };

    return (
        <button 
            className={`chat-window__send-btn ${isRecording ? 'chat-window__send-btn--active' : ''}`} 
            onClick={toggleRecording}
            disabled={isDisabled}
            aria-label={isRecording ? "Stop Recording" : "Start Voice Chat"}
            title={isRecording ? "Stop Recording" : "Start Voice Chat"}
            type="button"
            style={{ 
                marginRight: '8px',
                backgroundColor: isRecording ? '#ff4d4d' : undefined,
                color: isRecording ? '#fff' : undefined,
                opacity: isDisabled ? 0.5 : 1, 
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                position: 'relative'
            }}
        >
            {isRecording && <div className="voice-pulse-ring" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '10px', background: 'rgba(255, 77, 77, 0.4)', animation: 'pulse 1.5s infinite ease-out' }}></div>}
            {isRecording ? <MdStop size={20} style={{ zIndex: 1 }} /> : <MdKeyboardVoice size={20} />}
        </button>
    );
};

export default VoiceButton;
