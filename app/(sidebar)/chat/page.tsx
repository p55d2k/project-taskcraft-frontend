"use client";

import { useUser } from "@clerk/nextjs";
import useData from "@/hooks/useData";

import { sendMessage } from "@/utils/chat";

import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { IoIosChatboxes } from "react-icons/io";
import toast from "react-hot-toast";

import DashboardWrapper from "@/components/DashboardWrapper";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { ChatMessage } from "@/types";

const ChatPage = () => {
  const { user } = useUser();

  const { projectData, projectId } = useData();

  const [message, setMessage] = useState<string>("");
  const [attemptSendMessage, setAttemptSendMessage] = useState<boolean>(false);

  const [loading, setLoading] = useRecoilState(loadingAtom);

  const [conversation, setConversation] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!attemptSendMessage || !user || loading) return;

    (async () => {
      setLoading(true);

      try {
        await sendMessage(user?.username!, message, projectId);
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

    setLoading(false);
    setConversation(Object.values(projectData.chat));
  }, [projectData]);

  return (
    <DashboardWrapper loading={loading} pageName="Chat">
      <div className="flex flex-col space-y-4 pt-4 md:pt-6 flex-grow">
        <div className="flex-1 flex h-full flex-col-reverse space-y-4 overflow-y-auto">
          {conversation.length === 0 && (
            <div className="flex flex-col space-y-3 items-center h-full justify-center text-center">
              <IoIosChatboxes className="text-6xl" />
              <p className="text-lg md:text-xl max-w-md">
                No messages yet. Start a conversation by typing in the box
                below!
              </p>
            </div>
          )}

          <div className="space-y-2">
            {conversation.map((message, index) => {
              const isUser = message.name === user?.username;

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
        </div>

        <div className="w-full flex-none flex flex-row items-center justify-end pb-5 md:pb-8 lg:pb-10">
          <input
            type="text"
            placeholder="Ask anything..."
            className="input-field h-auto w-full mb-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) setAttemptSendMessage(true);
            }}
          />
          <button
            className="button-primary w-auto ml-4"
            onClick={() => setAttemptSendMessage(true)}
            disabled={loading}
          >
            <BsSendFill />
          </button>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default ChatPage;
