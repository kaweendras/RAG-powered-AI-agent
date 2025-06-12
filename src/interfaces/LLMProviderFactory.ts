import { LLMProvider } from "./LLMProvider";
import { ollamaProvider } from "../llmClients/ollamaClient/OllamaProvider";
import { googleAIProvider } from "../llmClients/googleClient/GoogleAIProvider";

export function getLLMProvider(provider: string): LLMProvider {
  switch (provider.toLowerCase()) {
    case "ollama":
      return ollamaProvider;
    case "google":
      return googleAIProvider;
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}
