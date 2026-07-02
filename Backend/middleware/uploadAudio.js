import multer from "multer";

/**
 * uploadAudio middleware
 *
 * Accepts audio uploads via multipart/form-data.
 * - Storage: memory (Buffer) — no disk writes, no cleanup needed.
 * - Size limit: 10 MB (configurable via MAX_AUDIO_SIZE_MB env var).
 * - MIME filter: only audio/* types (wav, mp3, ogg, webm, m4a, etc.)
 */

const MAX_SIZE_MB = parseInt(process.env.MAX_AUDIO_SIZE_MB || "10", 10);

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Accept any audio MIME type
    if (file.mimetype.startsWith("audio/")) {
        cb(null, true);
    } else {
        cb(
            new Error(`Unsupported file type: ${file.mimetype}. Only audio files are accepted.`),
            false
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_SIZE_MB * 1024 * 1024, // bytes
    },
});

/**
 * Multer error handler — converts multer-specific errors to JSON responses.
 * Mount this AFTER the multer middleware on any route that uses it.
 */
export const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                error: `Audio file too large. Maximum allowed size is ${MAX_SIZE_MB} MB.`,
            });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

// Export pre-configured single-file upload handler (field name: "audio")
export default upload;
