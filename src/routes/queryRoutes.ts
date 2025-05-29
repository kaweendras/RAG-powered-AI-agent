import express from "express";
import { aiQueryController } from "../controllers/queryController";

const router = express.Router();

// /**
//  * @route   POST /api/query/google
//  * @desc    Query Google AI with RAG context
//  * @access  Public
//  */
// router.post("/google", aiQueryController);

/**
 * @route   POST /api/query/ask
 * @desc    General endpoint for querying the AI with mode parameter
 * @access  Public
 */
router.post("/ask", aiQueryController);

export default router;
