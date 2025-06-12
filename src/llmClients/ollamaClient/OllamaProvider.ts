import { LLMProvider } from "../../interfaces/LLMProvider";
import { config } from "../../config/config";
import { cleanUtilForReasoningModels } from "../../utils/cleanUtilForReasoningModels";
import axios from "axios";
import { generateEnhancedPrompt } from "../../prompt/ContextPromptTemplate";

export const ollamaProvider: LLMProvider = {
  name: "ollama",

  async generateResponse(prompt: string, context: string): Promise<string> {
    try {
      // Get the enhanced prompt using the LangChain template
      const enhancedPrompt = await generateEnhancedPrompt(prompt, context);

      // Query Ollama API
      const response = await axios.post(
        `${config.OLLAMA_API_URL}/api/generate`,
        {
          model: config.OLLAMA_MODEL,
          prompt: enhancedPrompt,
          temperature: config.TEMPERATURE || 0.2,
          Stream: false,
        }
      );

      return cleanUtilForReasoningModels(response.data.response);
    } catch (error) {
      console.error("Error in OllamaProvider.generateResponse:", error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(
            `Ollama API error: ${JSON.stringify(error.response.data)}`
          );
        } else if (error.request) {
          throw new Error(`Ollama API connection error: No response received`);
        }
      }

      throw error;
    }
  },
};
