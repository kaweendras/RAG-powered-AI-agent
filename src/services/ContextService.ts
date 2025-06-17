import { embedText } from "../embed/nomicOllamaClient";
import { getCollection } from "../db/chromaDB";
import { getPineconeIndex } from "../db/pineDB";
import { querySupabaseByVector } from "../db/supabaseDB";
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
      console.error("Error using Pinecone:", error);
      // Return an empty result instead of falling back to ChromaDB
      results = { documents: [[]] };
    }
  } else if (
    (config.VECTORDB_TYPE.toUpperCase() === "SUPABASE" ||
      config.VECTORDB_TYPE.toUpperCase() === "SUPERBASE") &&
    config.SUPERBASE_KEY !== "SUPERBASE_KEY"
  ) {
    console.log("Using Supabase for vector search");
    try {
      const supabaseResults = await querySupabaseByVector(
        config.SUPERBASE_TABLE_NAME, // Use the table name from config
        queryEmbedding,
        3 // topK
      );

      // Extract documents from Supabase results
      if (supabaseResults && supabaseResults.length > 0) {
        const supabaseDocuments = supabaseResults.map(
          (match: any) => match.content
        );

        // Format results to match expected structure
        results = {
          documents: [supabaseDocuments],
        };
      }
    } catch (error) {
      console.error("Error using Supabase:", error);
      // Return an empty result instead of falling back to ChromaDB
      results = { documents: [[]] };
    }
  } else if (config.VECTORDB_TYPE.toUpperCase() === "CHROMA") {
    console.log("Using ChromaDB for vector search");
    const collection = await getCollection();
    results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: 3,
    });
  } else {
    // Default to empty results if no valid vector DB is configured
    console.log("No valid vector database configured");
    results = { documents: [[]] };
  }

  // Handle potential empty results
  if (!results?.documents?.[0] || results.documents[0].length === 0) {
    return "No relevant context found.";
  }

  // Join the retrieved context documents
  return results.documents[0].join("\n\n");
};
