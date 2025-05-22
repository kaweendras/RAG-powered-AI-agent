// filepath: /home/kaweendra/work/per/RAG-powered-AI-agent/src/routes/queryRoutes.ts
import express from "express";
import { queryGoogleAI } from "../controllers/queryController";

const router = express.Router();

/**
 * @route   POST /api/query/google
 * @desc    Query Google AI with RAG context
 * @access  Public
 */
router.post("/google", queryGoogleAI);

export default router;
