// filepath: /home/kaweendra/work/per/RAG-powered-AI-agent/src/controllers/queryController.ts
import { generateGoogleAIResponse } from "../llmClients/googleClient/queryClientGoogle";
/**
 * Handle queries to the Google AI model
 * @param req Express request object
 * @param res Express response object
 */
export const queryGoogleAI = async (req: any, res: any) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await generateGoogleAIResponse(query);
    res.json({ response });
  } catch (error) {
    console.error("Error processing Google AI query:", error);
    res.status(500).json({
      error: "Failed to process query",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
