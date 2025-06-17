import { chunkPdf } from "../utils/chuckUtil";
import { embedText } from "./nomicOllamaClient";
import { getCollection } from "../db/chromaDB";
import { upsertToPinecone } from "../db/pineDB";
import { upsertToSupabase } from "../db/supabaseDB";
import { config } from "../config/config";

async function run(filePath: string) {
  const chunks = await chunkPdf(filePath);

  // Only initialize ChromaDB if we're going to use it
  let collection;
  if (config.VECTORDB_TYPE.toUpperCase() === "CHROMA") {
    collection = await getCollection();
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embedText(chunk);

    // Choose vector DB based on configuration
    if (config.VECTORDB_TYPE.toUpperCase() === "PINECONE") {
      try {
        await upsertToPinecone(
          undefined, // Use default index name from config
          [
            {
              id: `chunk-${i}`,
              text: chunk,
              metadata: {
                source: filePath,
                chunkIndex: i,
                embedding: embedding, // Including the embedding in metadata for reference
              },
            },
          ]
        );
        console.log(`Added to Pinecone: chunk-${i}`);
      } catch (error) {
        console.error(`Error adding to Pinecone: ${error}`);
      }
    } else if (
      config.VECTORDB_TYPE.toUpperCase() === "SUPABASE" ||
      config.VECTORDB_TYPE.toUpperCase() === "SUPERBASE"
    ) {
      try {
        await upsertToSupabase(
          config.SUPERBASE_TABLE_NAME, // Use the table name from config
          [
            {
              id: `chunk-${i}`,
              text: chunk,
              metadata: {
                source: filePath,
                title: `Chunk ${i} from ${filePath.split("/").pop()}`,
                chunkIndex: i,
                embedding: embedding, // Including the embedding in metadata for reference
              },
            },
          ]
        );
        console.log(`Added to Supabase: chunk-${i}`);
      } catch (error) {
        console.error(`Error adding to Supabase: ${error}`);
      }
    } else {
      // Store in ChromaDB as default
      try {
        // Initialize collection if not done yet (this is the default case)
        if (!collection) {
          collection = await getCollection();
        }

        await collection.add({
          ids: [`chunk-${i}`],
          documents: [chunk],
          embeddings: [embedding],
        });
        console.log(`Added to ChromaDB: chunk-${i}`);
      } catch (error) {
        console.error(`Error adding to ChromaDB: ${error}`);
      }
    }

    console.log(`Indexed chunk ${i + 1}/${chunks.length}`);
  }
}

run("pdf/hp1.pdf");
