"use client";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { sendMessage } from "@/utils/chat";
import { navigate } from "@/utils/actions";
import { kanit } from "@/utils/fonts";

import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { IoIosChatboxes } from "react-icons/io";
import toast from "react-hot-toast";

import { ChatMessage } from "@/typings";

const ChatPage = () => {
  const { user } = useAuth();

  const { projectData, projectId, userData } = useData();
  if (!projectData || !projectId) navigate("/projects");

  const [message, setMessage] = useState<string>("");
  const [attemptSendMessage, setAttemptSendMessage] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [conversation, setConversation] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!attemptSendMessage || !user || !userData || loading) return;

    (async () => {
      setLoading(true);

      try {
        const newMessage = await sendMessage(
          user.uid,
          userData.name,
          message,
          projectId
        );

        setConversation((prev) => [...prev, newMessage]);
        setMessage("");
      } catch (error) {
        toast.error("Error sending message");
      } finally {
        setAttemptSendMessage(false);
        setLoading(false);
      }
    })();
  }, [attemptSendMessage]);

  useEffect(() => {
    if (!projectData || !projectData.chat) return;
    setConversation(Object.values(projectData.chat));
  }, [projectData]);

  return (
    <div className="w-full h-screen flex flex-col">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <AiOutlineLoading className="text-white text-6xl animate-spin" />
        </div>
      )}

      <div className="flex-grow flex flex-col space-y-4 md:space-y-6 p-4 md:p-8 lg:px-12 xl:px-16 divide-y-2 divide-[gray]">
        <div className="flex flex-col space-y-2" id="header">
          <h1
            className={`${kanit.className} text-2xl md:text-3xl lg:text-4xl text-[gray]`}
          >
            <span className="text-4xl md:text-5xl lg:text-6xl font-medium text-white pr-3">
              {projectData?.name}
            </span>
            Chat
          </h1>
        </div>

        <div className="flex flex-col space-y-4 pt-4 md:pt-6 flex-grow">
          <div className="flex-grow flex flex-col space-y-4 overflow-y-auto">
            {conversation.length === 0 && (
              <div className="flex flex-col space-y-3 items-center h-full justify-center text-center">
                <IoIosChatboxes className="text-6xl" />
                <p className="text-lg md:text-xl max-w-md">
                  No messages yet. Start a conversation by typing in the box
                  below!
                </p>
              </div>
            )}
            {conversation.map((message, index) => {
              const isUser = message.id === user?.uid;

              return (
                <div
                  key={index}
                  className={`flex flex-col space-y-1 ${
                    isUser ? "items-end text-right" : "items-start text-left"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      isUser ? "text-gray-500" : "text-gray-200"
                    }`}
                  >
                    {isUser ? "You" : message.name}
                  </p>
                  <p
                    className={`text-lg ${
                      isUser ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {message.message}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="w-full flex-none flex flex-row items-center justify-end pb-5 md:pb-8 lg:pb-10">
            <input
              type="text"
              placeholder="Ask anything..."
              className="input-field h-auto w-full mb-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setAttemptSendMessage(true);
              }}
            />
            <button
              className="button-primary w-auto ml-4"
              onClick={() => setAttemptSendMessage(true)}
            >
              <BsSendFill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
