import { embedText } from "../../embed/nomicOllamaClient";
import { getCollection } from "../../db/chromaDB";
import { config } from "../../config/config";
import { GoogleAIResponse } from "../../types/googleAITypes";
import { getPineconeIndex } from "../../db/pineDB";
import axios from "axios";

export async function generateGoogleAIResponse(
  prompt: string
): Promise<string> {
  try {
    // Get embeddings and query vector database for relevant context
    const queryEmbedding = await embedText(prompt);
    let results: any;

    // query the pinecone index if configured
    if (config.VECTORDB_TYPE.toUpperCase() === "PINECONE") {
      console.log("Using Pinecone for vector search");
      const pineconeIndex = await getPineconeIndex();
      const pineconeResults = await pineconeIndex.query({
        vector: queryEmbedding,
        topK: 3, // Get top 3 most relevant chunks
        includeValues: true,
        includeMetadata: true,
      });

      // If Pinecone results are available, merge them with ChromaDB results
      if (pineconeResults.matches && pineconeResults.matches.length > 0) {
        const pineconeDocuments = pineconeResults.matches
          .filter((match) => match.metadata !== undefined)
          .map((match) => match.metadata!.text);

        // Initialize results.documents if it doesn't exist yet
        if (!results) results = { documents: [[]] };
        if (!results.documents) results.documents = [[]];

        results.documents[0] = [
          ...(results.documents[0] || []),
          ...pineconeDocuments,
        ];
      }
    } else {
      console.log("Using ChromaDB for vector search");
      const collection = await getCollection();

      // Query the collection for the most relevant documents
      results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 3, // Get top 3 most relevant chunks
      });
    }
    // Join the retrieved context documents
    const context = results.documents[0].join("\n\n");

    const generationConfig = {
      temperature: config.TEMPERATURE || 0.1,
      topK: 10,
      topP: 0.95,
    };

    // Construct a prompt with the context and the original question
    const enhancedPrompt = `Answer the following question confidently with detailed explanation using only the information provided in this context. Avoid phrases like "based on the context" or "I'm not sure". If information isn't available, say so directly.\n\n${context}\n\nQuestion: ${prompt}`;

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

// (async () => {
//   try {
//     const response = await generateGoogleAIResponse(
//       "Who is the girl with harry?"
//     );
//     console.log("Google AI Response:", response);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
