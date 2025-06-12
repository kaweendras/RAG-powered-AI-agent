import { embedText } from "../embed/nomicOllamaClient";
import { getCollection } from "../db/chromaDB";
import { getPineconeIndex } from "../db/pineDB";
import { config } from "../config/config";

export const getContext = async (query: string): Promise<string> => {
  // Get embeddings for the query
  const queryEmbedding = await embedText(query);
  let results: any;

  // Query the appropriate vector database
  if (
    config.VECTORDB_TYPE.toUpperCase() === "PINECONE" &&
    config.PINECONE_API_KEY !== "YOUR_PINECONE_API_KEY"
  ) {
    console.log("Using Pinecone for vector search");
    try {
      const pineconeIndex = await getPineconeIndex();
      const pineconeResults = await pineconeIndex.query({
        vector: queryEmbedding,
        topK: 3,
        includeValues: true,
        includeMetadata: true,
      });

      // Extract documents from Pinecone results
      if (pineconeResults.matches?.length > 0) {
        const pineconeDocuments = pineconeResults.matches
          .filter((match: any) => match.metadata !== undefined)
          .map((match: any) => match.metadata!.text);

        // Format results to match expected structure
        results = {
          documents: [pineconeDocuments],
        };
      }
    } catch (error) {
      console.error("Error using Pinecone, falling back to ChromaDB:", error);
      // Fall back to ChromaDB if there's an error with Pinecone
      const collection = await getCollection();
      results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 3,
      });
    }
  } else {
    console.log("Using ChromaDB for vector search");
    const collection = await getCollection();
    results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 3,
    });
  }

  // Handle potential empty results
  if (!results?.documents?.[0] || results.documents[0].length === 0) {
    return "No relevant context found.";
  }

  // Join the retrieved context documents
  return results.documents[0].join("\n\n");
};
