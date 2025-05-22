import { ChromaClient } from "chromadb";
import { config } from "../config/config";

const client = new ChromaClient({ path: config.CHROMADB_URL });

export async function getCollection(name: string = config.CHROMADB_COLLECTION) {
  try {
    // Try to get the existing collection
    return await client.getCollection({
      name,
      embeddingFunction: undefined,
    });
  } catch (error) {
    // If the collection doesn't exist, create it with 768 dimensions
    return await client.createCollection({
      name,
      metadata: { dimensions: 768 },
      embeddingFunction: undefined,
    });
  }
}
