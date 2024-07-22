"use client";

import useData from "@/hooks/useData";

import { navigate } from "@/utils/actions";
import { kanit } from "@/utils/fonts";
import { getGPTResponseWithHistory } from "@/utils/ai";

import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { FaBrain } from "react-icons/fa";
import toast from "react-hot-toast";

import { OpenAIResponse } from "@/openai";

const AskAI = () => {
  const { projectData, projectId } = useData();
  if (!projectData || !projectId) navigate("/projects");

  const [prompt, setPrompt] = useState<string>("");
  const [sendPrompt, setSendPrompt] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [conversation, setConversation] = useState<string[]>([]);

  useEffect(() => {
    if (!sendPrompt) return;
    setLoading(true);

    async function sendPromptToAI() {
      const response: OpenAIResponse | void = await getGPTResponseWithHistory(
        conversation,
        prompt
      );
      if (!response) {
        toast.error("Error sending prompt to AI");
        setLoading(false);
        return;
      }

      const messages = response.choices[0].message.content;
      setConversation((prev) => [...prev, prompt, messages]);
      setPrompt("");

      setSendPrompt(false);
      setLoading(false);
    }

    sendPromptToAI();
  }, [sendPrompt]);

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
            Ask AI
          </h1>
        </div>

        <div className="flex flex-col space-y-4 pt-4 md:pt-6 flex-grow">
          <div className="flex-grow flex flex-col space-y-4 overflow-y-auto">
            {conversation.length === 0 && (
              <div className="flex flex-col space-y-3 items-center h-full justify-center text-center">
                <FaBrain className="text-6xl" />
                <p className="text-lg md:text-xl max-w-md">
                  Hi, I'm TaskCraft AI. I'm here to help you with anything you
                  need. Ask me anything!
                </p>
              </div>
            )}
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col space-y-1 ${
                  index % 2 === 0
                    ? "items-end text-right"
                    : "items-start text-left"
                }`}
              >
                <p
                  className={`text-sm ${
                    index % 2 === 0 ? "text-gray-500" : "text-gray-200"
                  }`}
                >
                  {index % 2 === 0 ? "You" : "TaskCraft AI"}
                </p>
                <p
                  className={`text-lg ${
                    index % 2 === 0 ? "text-gray-400" : "text-white"
                  }`}
                >
                  {message}
                </p>
              </div>
            ))}
          </div>

          <div className="w-full flex-none flex flex-row items-center justify-end pb-5 md:pb-8 lg:pb-10">
            <input
              type="text"
              placeholder="Ask anything..."
              className="input-field h-auto w-full mb-1"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setSendPrompt(true);
              }}
            />
            <button
              className="button-primary w-auto ml-4"
              onClick={() => setSendPrompt(true)}
            >
              <BsSendFill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskAI;
