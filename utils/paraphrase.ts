import { OpenAIResponse } from "@/openai";

export const paraphrase = async (
  to_paraphrase: string
): Promise<OpenAIResponse | null> => {
  if (!process.env.openaiKey) {
    console.error("No OpenAI API key");
    return null;
  }

  const openai_key = process.env.openaiKey;

  if (!to_paraphrase) {
    console.error("No prompt");
    return null;
  }

  const prompt = `Paraphrase "${to_paraphrase}". Do not add any additional word.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${openai_key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant made just to paraphrase text. Avoid repeating the same information in your response. Do not provide any personal information. Do not talk about anything outside the scope of the text you are paraphrasing. Do not add any additional word. Do not wrap your response in any quotes or HTML tags.`,
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
      return null;
    }
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    return null;
  }
};
