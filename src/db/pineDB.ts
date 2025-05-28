import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "../config/config";

const pc = new Pinecone({
  apiKey: config.PINECONE_API_KEY as string,
});

// Create a dense index with integrated embedding
const createIndex = async () => {
  const indexName = config.PINECONE_INDEX_NAME;
  await pc.createIndex({
    name: indexName,
    dimension: 768,
    metric: "cosine",
    spec: {
      serverless: {
        cloud: "aws",
        region: "us-east-1",
      },
    },
  });

  console.log(`Created index: ${indexName}`);
  return indexName;
};

// Function to get or create the Pinecone index
export async function getPineconeIndex(
  indexName: string = config.PINECONE_INDEX_NAME
) {
  try {
    // Check if the index exists
    const indexes = await pc.index(indexName);

    if (indexes) {
      console.log(`Using existing index: ${indexName}`);
      return indexes;
    } else {
      // If the index does not exist, create it
      console.log(`Index ${indexName} does not exist. Creating new index...`);
      await createIndex();
      return pc.index(indexName);
    }
  } catch (error) {
    console.error("Error getting or creating Pinecone index:", error);
    throw error;
  }
}
// Function to upsert documents to Pinecone
export async function upsertToPinecone(
  indexName: string = config.PINECONE_INDEX_NAME,
  documents: Array<{ id: string; text: string; metadata?: Record<string, any> }>
) {
  try {
    const index = await getPineconeIndex(indexName);

    // Create records in the format expected by Pinecone
    const records = documents.map((doc) => ({
      id: doc.id,
      text: doc.text,
      metadata: doc.metadata || {},
    }));

    return await index.upsert(records);
  } catch (error) {
    console.error("Error upserting to Pinecone:", error);
    throw error;
  }
}
