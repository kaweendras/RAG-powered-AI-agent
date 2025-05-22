// src/indexPdf.ts
import { chunkPdf } from "../utils/chuckUtil";
import { embedText } from "./nomicOllamaClient";
import { getCollection } from "../db/chromaDB";

async function run(filePath: string) {
  const chunks = await chunkPdf(filePath);
  const collection = await getCollection();

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embedText(chunk);

    await collection.add({
      ids: [`chunk-${i}`],
      documents: [chunk],
      embeddings: [embedding],
    });

    console.log(`Indexed chunk ${i + 1}/${chunks.length}`);
  }
}

run("research.pdf");
