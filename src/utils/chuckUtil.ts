import fs from "fs";
import pdf from "pdf-parse";

export async function chunkPdf(
  filePath: string,
  chunkSize = 500
): Promise<string[]> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const text = data.text;

  // Simple chunking
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}
