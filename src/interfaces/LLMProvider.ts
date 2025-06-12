export interface LLMProvider {
  generateResponse(prompt: string, context: string): Promise<string>;

  name: string;
}
