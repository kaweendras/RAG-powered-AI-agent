import { getLLMProvider } from "../interfaces/LLMProviderFactory";
import { getContext } from "../services/ContextService";

export const aiQueryController = async (req: any, res: any) => {
  try {
    const { query } = req.body;

    // Get mode parameter from query
    const mode = req.query.mode || "ollama";
    console.log("Mode:", mode);

    // Validate query
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // Get the appropriate LLM provider
    try {
      const provider = getLLMProvider(mode);

      // Get context from vector database
      const context = await getContext(query);

      // Generate response using the selected provider
      const response = await provider.generateResponse(query, context);
      res.json({ response });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Unsupported LLM provider")
      ) {
        return res.status(400).json({
          error: `Invalid mode: ${mode}. Supported modes: ollama, google`,
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error processing query:", error);

    // Provide a more specific error based on the error type
    const statusCode =
      error instanceof Error && error.message.includes("API error") ? 502 : 500;

    res.status(statusCode).json({
      error: "Failed to process query",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
