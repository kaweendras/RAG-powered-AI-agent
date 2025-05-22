import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 4000,
  CHROMADB_URL: process.env.CHROMADB_URL || "http://localhost:8000",
  CHROMADB_COLLECTION: process.env.CHROMADB_COLLECTION || "handbook",
  EMBEDDINGS_MODEL: process.env.EMBEDDINGS_MODEL || "nomic-embed-text:v1.5",
  OLLAMA_API_URL: process.env.OLLAMA_API_URL || "http://localhost:11434/api",
  LLM_MODEL: process.env.LLM_MODEL || "llama3.2:latest",
};
