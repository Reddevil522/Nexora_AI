import api from "./api";
import { handleError } from "../utils/errorHandler";

export const chatService = {
    sendMessage: async (payload) => {
        try {
            const response = await api.post("/api/chat", payload);
            return response.data;
        } catch (error) {
            throw new Error(handleError(error));
        }
    }
};
