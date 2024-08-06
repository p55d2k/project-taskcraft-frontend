"use client";

import { OpenAIResponse } from "@/openai";
import { ProjectData, TaskData } from "@/types";
import { generateUniqueId } from "./unique";
import { formatProjectData } from "./aiformatter";

export const getGPTResponse = async (
  prompt: string,
  projectData: ProjectData,
  username: string
): Promise<OpenAIResponse | void> => {
  if (!process.env.openaiKey) {
    console.error("No OpenAI API key");
    return;
  }

  const openai_key = process.env.openaiKey;

  if (!prompt) {
    console.error("No prompt");
    return;
  }

  const formattedProjectData = await formatProjectData(projectData);

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
            content: `You are an AI assistant part of a project management tool called TaskCraft who answers the user in a brief but clear and concise way. You should not respond with "AI: " at the beginning of your response. This is the project data you are working on: ${formattedProjectData}. Avoid repeating the same information in your response. Do not talk about anything outside the scope of the project data. Do not provide any personal information. If you want to create a task, you can do so by typing "Create a task" and then providing the task details, with the format of "Create a task { description, priority, assignedTo, dueDate }. description should be a brief description of the task, priority should be "low", "medium", or "high", assignedTo should be the username of the person you want to assign the task to (you can assign it to the current user, and make sure you only assign it to one person), and dueDate should be the due date of the task in DD/MM/YYYY. For example, returning: 'Create a task {description: "Complete the project documentation", priority: "high", assignedTo: "user123", dueDate: "15/10/2023"}' would work. Make sure that the data should be valid when I run JSON.parse on it. Do not unnecessarily create tasks if the user did not specify to create one. The current date is ${new Date().toLocaleDateString()}. The current user is ${username}. When displaying data from the project or a task, make sure to display it in a way that is easy to read and understand. Do not bold or italicize any text. You can use "\n" to create new lines.`,
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

export const extractTaskFromGPTResponse = (
  response: OpenAIResponse,
  projectID: string
): TaskData | null => {
  if (!response || !response.choices || response.choices.length === 0) {
    console.log("No response or unexpected response structure");
    return null;
  }

  const messages = response.choices[0].message.content;

  const taskRegex = /Create a task {([^}]*)}/;
  const taskMatch = messages.match(taskRegex);

  if (!taskMatch || taskMatch.length < 2) {
    console.log("No task match found in response:", messages);
    return null;
  }

  console.log("Task match:", taskMatch[1]);

  const correctedTaskData = taskMatch[1].replace(/(\w+):/g, '"$1":');

  try {
    const rawReturnedData = JSON.parse("{" + correctedTaskData + "}");
    const taskData: TaskData = {
      ...rawReturnedData,
      assignedTo: [rawReturnedData.assignedTo] || [],
      dueDate: new Date(rawReturnedData.dueDate + " 00:00").getTime(),
      project: projectID,
      id: generateUniqueId(),
      status: "progress",
      assignedBy: "AI",
      createdAt: Date.now(),
      completedAt: 0,
    };

    return taskData;
  } catch (error) {
    console.error("Error parsing task data:", error);
    return null;
  }
};

export const getGPTResponseWithHistory = async (
  conversation: (string | TaskData)[],
  prompt: string,
  projectData: ProjectData,
  username: string
): Promise<OpenAIResponse | void> => {
  if (!prompt) {
    console.error("No prompt");
    return;
  }

  if (prompt.length > 1024) {
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

  return getGPTResponse(
    combinedPrompt + `User: ${prompt}`,
    projectData,
    username
  );
};
export const projectSummary = async (
  projectstatus: ProjectData,
  username: string
): Promise<OpenAIResponse | void> => {
  await getGPTResponse(
    `Generate a summary for this project`,
    projectstatus,
    username
  );
};
