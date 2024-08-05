"use client";

import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import {
  deleteTask,
  doesTaskExist,
  getTask,
  markTaskAsCompleted,
} from "@/utils/tasks";
import { kanit } from "@/utils/fonts";
import { navigate } from "@/actions/navigate";
import { nameFromId } from "@/utils/users";

import Loading from "@/components/Loading";

import { TaskData } from "@/types";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { useEffect, useState } from "react";
import Link from "next/link";

import toast from "react-hot-toast";

const TaskViewPage = ({ params }: { params: { id: string } }) => {
  const { projectId } = useData();

  const { user } = useAuth();

  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [taskData, setTaskData] = useState<TaskData | null>(null);

  const [assignedBy, setAssignedBy] = useState<string | null>(null);
  const [assignedTo, setAssignedTo] = useState<string[] | null>(null);

  const [isAssignedToUser, setIsAssignedToUser] = useState<boolean>(false);
  const [isAssignedByUser, setIsAssignedByUser] = useState<boolean>(false);

  const [reloadTask, setReloadTask] = useState<boolean>(false);

  useEffect(() => {
    if (!projectId || !user) return;

    (async () => {
      setLoading(true);

      const taskExists = await doesTaskExist(params.id);
      if (!taskExists) {
        navigate("/tasks");
        toast.error("Task does not exist");

        setReloadTask(false);
        setLoading(false);

        return;
      }

      try {
        const fetchedTaskData = await getTask(params.id);

        if (fetchedTaskData.project !== projectId) {
          toast.error("You do not have access to this task.");
          navigate("/tasks");

          setReloadTask(false);
          setLoading(false);

          return;
        }

        setTaskData(fetchedTaskData);

        if (fetchedTaskData.assignedBy === "AI") setAssignedBy("AI");
        else setAssignedBy(await nameFromId(fetchedTaskData.assignedBy));

        fetchedTaskData.assignedTo.forEach(async (id) => {
          const name = await nameFromId(id);
          setAssignedTo((prev) => [...(prev || []), name]);
        });

        if (fetchedTaskData.assignedTo.includes(user.uid)) {
          setIsAssignedToUser(true);
        }

        if (fetchedTaskData.assignedBy === user.uid) {
          setIsAssignedByUser(true);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Something went wrong. Please try again later.");

        navigate("/tasks");
        throw error;
      } finally {
        setReloadTask(false);
        setLoading(false);
      }
    })();
  }, [projectId, params, user, reloadTask]);

  return (
    <div className="w-full h-full flex flex-col">
      <Loading loading={loading} />

      <div className="flex flex-col space-y-4 md:space-y-6 p-4 md:p-8 lg:px-12 xl:px-16 divide-y-2 divide-[gray]">
        <h1
          className={`${kanit.className} text-2xl md:text-3xl lg:text-4xl text-[gray] flex flex-col md:items-end md:flex-row`}
        >
          <span className="text-4xl md:text-5xl lg:text-6xl font-medium text-white pr-3 text-center md:text-left">
            Task
          </span>
        </h1>

        <div className="w-full h-full flex flex-col space-y-4 pt-4 md:pt-6">
          <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
            <h2 className="text-xl md:text-2xl">Task Details</h2>

            <div className="flex-col flex space-y-2 pt-4">
              <p className="text-lg md:text-xl">
                Description:
                <br />
                <span className="text-blue-500 font-semibold">
                  {taskData?.description}
                </span>
              </p>

              <p className="md:text-lg pt-4">
                Priority:{" "}
                <span
                  className={`${
                    taskData?.priority === "high"
                      ? "text-red-500"
                      : taskData?.priority === "medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  } capitalize font-semibold`}
                >
                  {taskData?.priority}
                </span>
              </p>

              <p className="md:text-lg">
                Status:{" "}
                <span
                  className={`${
                    taskData?.status === "completed"
                      ? "text-green-500"
                      : taskData?.status === "progress"
                      ? "text-yellow-500"
                      : "text-red-500"
                  } capitalize font-semibold`}
                >
                  {taskData?.status}
                </span>
              </p>

              {taskData?.completedAt && taskData?.status === "completed" ? (
                <p className="md:text-lg">
                  Completed on:{" "}
                  <span className="capitalize text-green-500 font-semibold">
                    {new Date(taskData?.completedAt!).toDateString()}{" "}
                    {new Date(taskData?.completedAt!).toLocaleTimeString() ||
                      "No data"}
                  </span>
                </p>
              ) : (
                <p className="md:text-lg">
                  Due by:{" "}
                  <span className="capitalize text-red-500 font-semibold">
                    {new Date(taskData?.dueDate!).toDateString()}{" "}
                    {new Date(taskData?.dueDate!).toLocaleTimeString() ||
                      "No due date"}
                  </span>
                </p>
              )}

              <p className="md:text-lg">
                Created on:{" "}
                <span className="capitalize text-blue-500 font-semibold">
                  {new Date(taskData?.createdAt!).toDateString()}{" "}
                  {new Date(taskData?.createdAt!).toLocaleTimeString() ||
                    "No data"}
                </span>
              </p>

              {taskData?.assignedTo.length! > 0 && (
                <p className="md:text-lg">
                  Assigned to:{" "}
                  {taskData?.assignedTo.map((id, index) => (
                    <Link
                      key={index}
                      href={`/users/${id}`}
                      className="font-semibold"
                    >
                      {assignedTo?.[index]}
                    </Link>
                  ))}
                </p>
              )}

              {taskData?.assignedBy && (
                <p className="md:text-lg">
                  Assigned by:{" "}
                  {assignedBy === "AI" ? (
                    <span className="font-semibold">AI</span>
                  ) : (
                    <Link href={`/users/${taskData?.assignedBy}`}>
                      <span className="font-semibold">{assignedBy}</span>
                    </Link>
                  )}
                </p>
              )}
            </div>
          </div>

          {taskData?.status !== "completed" && (
            <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
              <h2 className="text-xl md:text-2xl">Edit Task</h2>

              <div className="flex-col flex space-y-2 pt-4">
                {isAssignedToUser && (
                  <button
                    className="button-safe"
                    onClick={async () => {
                      try {
                        markTaskAsCompleted(taskData?.id!);
                        setReloadTask(true);

                        toast.success("Task marked as completed successfully.");
                      } catch (error) {
                        toast.error(
                          "Failed to mark task as completed. Please try again later."
                        );
                        console.error(
                          "Failed to mark task as completed:",
                          error
                        );
                      }
                    }}
                  >
                    Mark As Complete
                  </button>
                )}

                {isAssignedByUser && (
                  <button
                    className="button-danger"
                    onClick={async () => {
                      try {
                        deleteTask(
                          taskData?.id!,
                          taskData?.project!,
                          taskData?.status || "progress"
                        );
                        navigate("/tasks");

                        toast.success("Task deleted successfully.");
                      } catch (error) {
                        toast.error(
                          "Failed to delete task. Please try again later."
                        );
                        console.error("Failed to delete task:", error);
                      }
                    }}
                  >
                    Delete Task
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskViewPage;
