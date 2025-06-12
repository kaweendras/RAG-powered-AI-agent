import { PromptTemplate } from "@langchain/core/prompts";

// Import JSON with type assertion
import promptJsonData from "./contextPrompt.json";
const promptData = promptJsonData as { template: string };

export const contextPromptTemplate = PromptTemplate.fromTemplate(
  promptData.template
);

export const generateEnhancedPrompt = async (
  query: string,
  context: string
): Promise<string> => {
  return await contextPromptTemplate.format({
    query,
    context,
  });
};
