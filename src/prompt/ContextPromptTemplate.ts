import { PromptTemplate } from "@langchain/core/prompts";

export const contextPromptTemplate = PromptTemplate.fromTemplate(
  `Answer the following question confidently with detailed explanation using only the information provided in this context. Avoid phrases like "based on the context" or "I'm not sure". If information isn't available, say so directly.

{context}

Question: {query}`
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
