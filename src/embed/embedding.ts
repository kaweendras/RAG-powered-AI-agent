// src/embed.ts
import axios from "axios";

export async function embedText(text: string): Promise<number[]> {
  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "nomic-embed-text:v1.5",
    prompt: text,
    stream: false,
  });
  return response.data.embedding;
}
