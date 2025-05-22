import { embedText } from "../../embed/nomicOllamaClient";
import { getCollection } from "../../db/chromaDB";
import { config } from "../../config/config";
import { GoogleAIResponse } from "../../types/googleAITypes";
import axios from "axios";

/**
 * Generate a response from Google AI with RAG capabilities
 * Queries the ChromaDB collection for relevant context before asking Google AI
 */
export async function generateGoogleAIResponse(
  prompt: string
): Promise<string> {
  try {
    // Get embeddings and query vector database for relevant context
    const queryEmbedding = await embedText(prompt);
    const collection = await getCollection();

    // Query the collection for the most relevant documents
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 3, // Get top 3 most relevant chunks
    });

    // Join the retrieved context documents
    const context = results.documents[0].join("\n\n");

    // Construct a prompt with the context and the original question
    const enhancedPrompt = `Answer the following question confidently with detailed explenation based only on this context:\n\n${context}\n\nQuestion: ${prompt}`;

    const API_URL = `${config.GOOGLEAI_API_URL}${config.GOOGLEAI_MODEL_NAME}:generateContent?key=${config.GOOGLEAI_API_KEY}`;
    const requestData = {
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

    const response = await axios.post<GoogleAIResponse>(API_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
      throw new Error(`Google AI API error: ${JSON.stringify(error)}`);
    }
    console.error("Error in generateGoogleAIResponse:", error);
    throw error;
  }
}

(async () => {
  try {
    const response = await generateGoogleAIResponse(
      "are there any existing simmilar projects to this research?"
    );
    console.log("Google AI Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
})();
