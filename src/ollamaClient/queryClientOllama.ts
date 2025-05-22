// src/query.ts
import { embedText } from "../embed/nomicOllamaClient";
import { getCollection } from "../db/chromaDB";
import { config } from "../config/config";
import axios from "axios";

async function askQuestion(question: string) {
  const queryEmbedding = await embedText(question);
  const collection = await getCollection();

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: 3,
  });

  const context = results.documents[0].join("\n\n");

  const response = await axios.post(`${config.OLLAMA_API_URL}/api/generate`, {
    model: config.LLM_MODEL,
    prompt: `Answer the following confidently based only on context:\n\n${context}\n\nQuestion: ${question}`,
    stream: false,
  });

  console.log(`Answer:\n${response.data.response}`);
}

// Self-invoke async function to handle the async call
(async () => {
  try {
    await askQuestion("What is the purpose of this research?");
  } catch (error) {
    console.error("Error asking question:", error);
  }
})();
