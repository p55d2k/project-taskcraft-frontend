import { ref, get, child, remove, set } from "firebase/database";
import { db } from "@/firebase";

import { ChatMessage } from "@/types";

export const sendMessage = async (
  name: string,
  message: string,
  projectId: string // pid
): Promise<ChatMessage> => {
  try {
    const chatRef = ref(db, `projects/${projectId}/chat`);

    const newMessage: ChatMessage = {
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
