import * as dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 4000,
  CHROMADB_URL: process.env.CHROMADB_URL || "http://localhost:8000",
  CHROMADB_COLLECTION: process.env.CHROMADB_COLLECTION || "handbook",
};
