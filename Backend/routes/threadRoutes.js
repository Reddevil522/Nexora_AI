import express from "express";
import { getAllThreads, getThreadMessages, deleteThread } from "../controllers/threadController.js";
import checkThreadOwnership from "../middleware/checkThreadOwnership.js";

const router = express.Router();

router.get("/", getAllThreads);
router.get("/:threadId", checkThreadOwnership, getThreadMessages);
router.delete("/:threadId", checkThreadOwnership, deleteThread);

export default router;
