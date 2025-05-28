import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 4000,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || "YOUR_PINECONE_API_KEY",
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME || "handbook-index",
  CHROMADB_URL: process.env.CHROMADB_URL || "http://localhost:8000",
  CHROMADB_COLLECTION: process.env.CHROMADB_COLLECTION || "handbook",
  EMBEDDINGS_MODEL: process.env.EMBEDDINGS_MODEL || "nomic-embed-text:v1.5",
  OLLAMA_API_URL: process.env.OLLAMA_API_URL || "http://localhost:11434/api",
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || "llama3.2:latest",
  GOOGLEAI_MODEL_NAME: process.env.GOOGLEAI_MODEL_NAME || "gemini-2.0-flash",
  GOOGLEAI_API_KEY: process.env.GOOGLEAI_API_KEY || "YOUR_GOOGLEAI_API_KEY",
  GOOGLEAI_API_URL:
    process.env.GOOGLEAI_API_URL ||
    "https://generativelanguage.googleapis.com/v1beta/models/",
  TEMPERATURE: parseFloat(process.env.TEMPERATURE || "0.2"),
  SEED: parseInt(process.env.SEED || "42", 10),
};
