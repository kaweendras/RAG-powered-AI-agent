// src/embed.ts
import axios from "axios";
import { config } from "../config/config";

export async function embedText(text: string): Promise<number[]> {
  const response = await axios.post(`${config.OLLAMA_API_URL}/api/embeddings`, {
    model: config.EMBEDDINGS_MODEL,
    prompt: text,
    stream: false,
  });
  console.log(response.data.embedding);
  return response.data.embedding;
}
