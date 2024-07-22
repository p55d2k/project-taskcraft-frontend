import OpenAI from "openai";

const openai = new OpenAI({
  organization: "org-33JXSM7dG0tetV0sjsaaLyuz",
  project: "proj_ajQlm33YidOZyP1Uds5ErzMO",
});

export default openai;

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: {
      role: string;
      content: string;
    };
    logprobs: null;
    finish_reason: string;
    index: number;
  }[];
}
