import { ChromaClient } from "chromadb";
import { config } from "../config/config";

const client = new ChromaClient({ path: config.CHROMADB_URL });

export async function getCollection(name: string = config.CHROMADB_COLLECTION) {
  return await client.getOrCreateCollection({
    name,
    embeddingFunction: undefined,
  });
}
