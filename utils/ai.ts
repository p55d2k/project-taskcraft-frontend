import { OpenAIResponse } from "@/openai";
import { ProjectData } from "@/typings";

export const getGPTResponse = async (
  prompt: string
): Promise<OpenAIResponse | void> => {
  if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
    console.error("No OpenAI API key");
    return;
  }

  if (!prompt) {
    console.error("No prompt");
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              'You are a helpful assistant who reads the input of the user and answer the user in a brief but clear and concise way. However, you should not respond with "AI: " at the beginning of your response.',
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    if (
      data &&
      data.choices &&
      data.choices.length > 0 &&
      data.choices[0].message
    ) {
      return data;
    } else {
      console.error("No data or unexpected response structure:", data);
    }
  } catch (error) {
    console.error("Error fetching GPT response:", error);
  }
};

export const getGPTResponseWithHistory = async (
  conversation: string[],
  prompt: string
): Promise<OpenAIResponse | void> => {
  if (!prompt) {
    console.error("No prompt");
    return;
  }

  if (prompt.length > 100) {
    console.error("Prompt is too long");
    return;
  }

  const recentConversation = conversation.slice(-6);
  let combinedPrompt = "";

  for (let i = 0; i < recentConversation.length; i += 2) {
    combinedPrompt += `User: ${recentConversation[i]}\nAI: ${
      recentConversation[i + 1]
    }\n`;
  }

  return getGPTResponse(combinedPrompt + `User: ${prompt}`);
};
export const projectSummary = async (
  projectstatus: ProjectData
): Promise<OpenAIResponse | void> => {
  await getGPTResponse(
    `Generate a summary for project ${projectstatus.name} with id ${projectstatus.id}`
  );
};
