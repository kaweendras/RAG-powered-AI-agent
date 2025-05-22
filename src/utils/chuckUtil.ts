import fs from "fs";
import pdf from "pdf-parse";

export async function chunkPdf(
  filePath: string,
  chunkSize = 500,
  overlap = 100
): Promise<string[]> {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdf(dataBuffer);
  const text = data.text;

  // Chunking with overlap
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += chunkSize - overlap) {
    // Stop if we've reached the end
    if (i >= words.length) break;

    chunks.push(words.slice(i, i + chunkSize).join(" "));
  }

  return chunks;
}

// //run the function
// (async () => {
//   const chunks = await chunkPdf("pdf/research.pdf", 500, 100);
//   console.log(chunks);
// })();
