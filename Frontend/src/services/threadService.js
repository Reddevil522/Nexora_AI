import api from "./api";
import { handleError } from "../utils/errorHandler";

export const threadService = {
    getThreads: async () => {
        try {
            const response = await api.get("/api/thread");
            return response.data;
        } catch (error) {
            throw new Error(handleError(error));
        }
    },
    getThread: async (id) => {
        try {
            const response = await api.get(`/api/thread/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleError(error));
        }
    },
    createThread: async (threadData = {}) => {
        try {
            const response = await api.post("/api/thread", threadData);
            return response.data;
        } catch (error) {
            throw new Error(handleError(error));
        }
    },
    deleteThread: async (id) => {
        try {
            const response = await api.delete(`/api/thread/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(handleError(error));
        }
    }
};
