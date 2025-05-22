export interface GoogleAIResponse {
  candidates?: {
    content: {
      parts: {
        text: string;
      }[];
    };
    finishReason: string;
  }[];
  error?: {
    message: string;
  };
}
