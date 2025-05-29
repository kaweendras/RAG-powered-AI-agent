import { embedText } from "../../embed/nomicOllamaClient";
import { getCollection } from "../../db/chromaDB";
import { config } from "../../config/config";
import { getPineconeIndex } from "../../db/pineDB";
import axios from "axios";
import { cleanUtilForReasoningModels } from "../../utils/cleanUtilForReasoningModels";

export async function GenerateOllamaResponse(prompt: string): Promise<string> {
  try {
    // Get embeddings and query vector database for relevant context
    const queryEmbedding = await embedText(prompt);
    let results: any;

    // Query the appropriate vector database
    if (config.VECTORDB_TYPE.toUpperCase() === "PINECONE") {
      console.log("Using Pinecone for vector search");
      const pineconeIndex = await getPineconeIndex();
      const pineconeResults = await pineconeIndex.query({
        vector: queryEmbedding,
        topK: 3,
        includeValues: true,
        includeMetadata: true,
      });

      // Extract documents from Pinecone results
      if (pineconeResults.matches?.length > 0) {
        results = {
          documents: [
            pineconeResults.matches
              .filter((match) => match.metadata)
              .map((match) => match.metadata!.text),
          ],
        };
      }
    } else {
      console.log("Using ChromaDB for vector search");
      const collection = await getCollection();
      results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 3,
      });
    }

    // Join the retrieved context documents
    const context = results?.documents?.[0]?.join("\n\n") || "";

    // Construct prompt with context and question
    const enhancedPrompt = `Answer the following question confidently with detailed explanation using only the information provided in this context. Avoid phrases like "based on the context" or "I'm not sure". If information isn't available, say so directly.\n\n${context}\n\nQuestion: ${prompt}`;

    // Query Ollama API
    const response = await axios.post(
      `${config.OLLAMA_API_URL}/api/generate/`,
      {
        model: config.OLLAMA_MODEL,
        prompt: enhancedPrompt,
        temperature: config.TEMPERATURE || 0.2,
        Stream: false,
      }
    );

    return cleanUtilForReasoningModels(response.data.response);
  } catch (error) {
    console.error("Error in generating Ollama response:", error);
    throw error;
  }
}

(async () => {
  try {
    const response = await GenerateOllamaResponse("What is this story about?");
    console.log("Ollama Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
})();
