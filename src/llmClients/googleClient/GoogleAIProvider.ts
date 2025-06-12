import { LLMProvider } from "../../interfaces/LLMProvider";
import { config } from "../../config/config";
import { GoogleAIResponse } from "../../types/googleAITypes";
import axios from "axios";
import { generateEnhancedPrompt } from "../../prompt/ContextPromptTemplate";

export const googleAIProvider: LLMProvider = {
  name: "google",

  async generateResponse(prompt: string, context: string): Promise<string> {
    try {
      const generationConfig = {
        temperature: config.TEMPERATURE || 0.1,
        topK: 10,
        topP: 0.95,
      };

      // Get the enhanced prompt using the LangChain template
      const enhancedPrompt = await generateEnhancedPrompt(prompt, context);

      const API_URL = `${config.GOOGLEAI_API_URL}${config.GOOGLEAI_MODEL_NAME}:generateContent?key=${config.GOOGLEAI_API_KEY}`;
      const requestData = {
        generationConfig,
        contents: [
          {
            parts: [
              {
                text: enhancedPrompt,
              },
            ],
          },
        ],
      };

      const response = await axios.post<GoogleAIResponse>(
        API_URL,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Extract text from response
      if (response.data.candidates && response.data.candidates.length > 0) {
        const textResponse = response.data.candidates[0].content.parts[0].text;
        return textResponse;
      } else {
        console.error("No candidates found in Google AI response");
      }

      throw new Error("No valid response from Google AI");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          "Error in Google AI API response:",
          error.response.status,
          error.response.statusText,
          error.response.data
        );
        throw new Error(
          `Google AI API error: ${JSON.stringify(error.response.data)}`
        );
      }
      console.error("Error in GoogleAIProvider.generateResponse:", error);
      throw error;
    }
  },
};
