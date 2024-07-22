import { ref, get, child, remove, set } from "firebase/database";
import { db } from "@/firebase";

import { ChatMessage } from "@/typings";

export const sendMessage = async (
  from: string, // uid
  name: string,
  message: string,
  projectId: string // pid
): Promise<ChatMessage> => {
  try {
    const chatRef = ref(db, `projects/${projectId}/chat`);

    const newMessage: ChatMessage = {
      id: from,
      name: name,
      message: message,
      timestamp: Date.now(),
    };

    await set(child(chatRef, `${newMessage.timestamp}`), newMessage);

    return newMessage;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
