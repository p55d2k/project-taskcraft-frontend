"use client";

import {
  extractTaskFromGPTResponse,
  getGPTResponseWithHistory,
} from "@/utils/ai";
import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import DashboardWrapper from "@/components/DashboardWrapper";

import { useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs";
import { FaBrain } from "react-icons/fa";
import toast from "react-hot-toast";

import { OpenAIResponse } from "@/openai";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { TaskData } from "@/types";
import AITaskDataCard from "@/components/tasks/AITaskDataCard";
import { createTask } from "@/utils/tasks";

const AskAI = () => {
  const [prompt, setPrompt] = useState<string>("");
  const [sendPrompt, setSendPrompt] = useState<boolean>(false);

  const [loading, setLoading] = useRecoilState(loadingAtom);

  const [conversation, setConversation] = useState<(string | TaskData)[]>([]);

  const { projectData, projectId } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if (!sendPrompt || !projectData || !user) return;
    setLoading(true);

    (async () => {
      try {
        const response: OpenAIResponse | void = await getGPTResponseWithHistory(
          conversation,
          prompt,
          projectData,
          user.uid
        );

        if (!response) {
          throw new Error("No response from AI");
        }

        const task = extractTaskFromGPTResponse(response, projectData.id);

        if (!task)
          setConversation((prev) => [
            ...prev,
            prompt,
            response.choices[0].message.content,
          ]);
        else {
          setConversation((prev) => [...prev, prompt, task]);
          await createTask(task, projectId);
        }

        setPrompt("");
      } catch (error) {
        console.error(error);
        toast.error("Error sending prompt to AI");
      } finally {
        setSendPrompt(false);
        setLoading(false);
      }
    })();
  }, [sendPrompt]);

  return (
    <DashboardWrapper loading={loading} pageName="Ask AI">
      <div className="flex flex-col space-y-4 pt-4 md:pt-6 flex-grow">
        <div className="flex-1 flex h-full flex-col-reverse space-y-4 overflow-y-auto">
          {conversation.length === 0 && (
            <div className="flex flex-col space-y-3 items-center h-full justify-center text-center">
              <FaBrain className="text-6xl" />
              <p className="text-lg md:text-xl max-w-md">
                Hi, I&apos;m TaskCraft AI. I&apos;m here to help you with
                anything you need. Ask me anything!
              </p>
            </div>
          )}

          {conversation.toReversed().map((message, index) => {
            if (typeof message === "string") {
              return (
                <div
                  key={index}
                  className={`flex flex-col space-y-1 ${
                    index % 2 === 1
                      ? "items-end text-right"
                      : "items-start text-left lg:max-w-[50vw]"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      index % 2 === 1 ? "text-gray-500" : "text-gray-200"
                    }`}
                  >
                    {index % 2 === 1 ? "You" : "TaskCraft AI"}
                  </p>
                  <p
                    className={`text-lg ${
                      index % 2 === 1 ? "text-gray-400" : "text-white"
                    }`}
                  >
                    {message.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </p>
                </div>
              );
            } else {
              return (
                <div
                  key={index}
                  className="flex flex-col space-y-1 items-start text-left"
                >
                  <p className="text-sm text-gray-200">
                    {index % 2 === 1 ? "You" : "TaskCraft AI"}
                  </p>

                  <AITaskDataCard taskData={message as TaskData} />
                </div>
              );
            }
          })}
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
    </DashboardWrapper>
  );
};

export default AskAI;
