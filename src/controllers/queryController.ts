import { generateGoogleAIResponse } from "../llmClients/googleClient/queryClientGoogle";
import { GenerateOllamaResponse } from "../llmClients/ollamaClient/queryClientOllama";

export const aiQueryController = async (req: any, res: any) => {
  try {
    const { query } = req.body;

    //catch mode parameter from query
    const mode = req.query.mode || "ollama";
    console.log("Mode:", mode);

    const MODEL =
      mode.toLowerCase() === "ollama"
        ? GenerateOllamaResponse
        : generateGoogleAIResponse;

    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await MODEL(query);
    res.json({ response });
  } catch (error) {
    console.error("Error processing Google AI query:", error);
    res.status(500).json({
      error: "Failed to process query",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
