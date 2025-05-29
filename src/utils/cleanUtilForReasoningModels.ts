//if string contains <think> or <reasoning> tags, remove them and everything in between <think> and </think> or <reasoning> and </reasoning>
export function cleanUtilForReasoningModels(response: string): string {
  // Remove <think> tags and everything in between
  response = response.replace(/<think>[\s\S]*?<\/think>/g, "");

  // Remove <reasoning> tags and everything in between
  response = response.replace(/<reasoning>[\s\S]*?<\/reasoning>/g, "");

  // Remove any remaining <think> or <reasoning> tags
  response = response.replace(/<\/?think>/g, "");
  response = response.replace(/<\/?reasoning>/g, "");

  return response;
}
