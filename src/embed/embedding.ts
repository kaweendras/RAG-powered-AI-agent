import { chunkPdf } from "../utils/chuckUtil";
import { embedText } from "./nomicOllamaClient";
import { getCollection } from "../db/chromaDB";
import { upsertToPinecone } from "../db/pineDB";
import { config } from "../config/config";

async function run(filePath: string) {
  const chunks = await chunkPdf(filePath);
  const collection = await getCollection();

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embedText(chunk);

    // Store in Pinecone if configured to use it
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
    } else {
      // Store in ChromaDB for now
      try {
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
