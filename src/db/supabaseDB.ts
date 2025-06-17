import { createClient } from "@supabase/supabase-js";
import { config } from "../config/config";

// Create a Supabase client
const supabase = createClient(
  config.SUPERBASE_URL as string,
  config.SUPERBASE_KEY as string
);

// Default table name for documents
const DEFAULT_TABLE_NAME = config.SUPERBASE_TABLE_NAME || "documents";

// Function to check if the documents table exists
export async function getSupabaseIndex(tableName: string = DEFAULT_TABLE_NAME) {
  try {
    // Check if the documents table exists by querying it
    const { data, error } = await supabase
      .from(tableName)
      .select("count")
      .limit(1);

    if (error) {
      console.error(`Table ${tableName} might not exist: ${error.message}`);
      throw new Error(
        `The documents table doesn't exist. Please run the SQL setup script first.`
      );
    } else {
      console.log(`Using existing table: ${tableName}`);
    }

    return tableName;
  } catch (error) {
    console.error("Error checking Supabase vector table:", error);
    throw error;
  }
}

// Function to upsert documents to Supabase
export async function upsertToSupabase(
  tableName: string = DEFAULT_TABLE_NAME,
  documents: Array<{ id: string; text: string; metadata?: Record<string, any> }>
) {
  try {
    await getSupabaseIndex(tableName);

    // Create records in the format expected by Supabase
    const records = documents.map((doc) => {
      // If embedding is provided in metadata, use it as embedding
      const embedding = doc.metadata?.embedding;

      // Get title from metadata or generate one
      const title = doc.metadata?.title || `Document ${doc.id}`;

      // Remove embedding from metadata to avoid duplication
      const { embedding: _, ...metadataWithoutEmbedding } = doc.metadata || {};

      return {
        id: doc.id,
        title: title,
        content: doc.text,
        embedding: embedding,
        metadata: metadataWithoutEmbedding,
      };
    });

    // Insert or update records in the Supabase table
    const { data, error } = await supabase
      .from(tableName)
      .upsert(records)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error upserting to Supabase:", error);
    throw error;
  }
}

// Function to query vectors from Supabase by similarity
export async function querySupabaseByVector(
  tableName: string = DEFAULT_TABLE_NAME,
  queryEmbedding: number[],
  topK: number = 5
) {
  try {
    await getSupabaseIndex(tableName);

    // Query for similar vectors using the match_documents function
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      similarity_threshold: 0.5,
      match_count: topK,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error querying Supabase by vector:", error);
    throw error;
  }
}

// Initialize Supabase index
// (async () => {
//   try {
//     await getSupabaseIndex();
//     console.log("Supabase index is ready.");
//   } catch (error) {
//     console.error("Error initializing Supabase index:", error);
//   }
// })();
