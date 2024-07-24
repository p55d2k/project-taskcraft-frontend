"use client";

import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import { getTasksForUserInProject } from "@/utils/tasks";
import { kanit } from "@/utils/fonts";
import { getUserRoleInProject } from "@/utils/users";

import { AiOutlineLoading } from "react-icons/ai";

import TaskCard from "@/components/tasks/Card";

import { Role, TaskData } from "@/typings";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { useEffect, useState } from "react";
import Link from "next/link";

import toast from "react-hot-toast";

const TasksViewPage = () => {
  const { projectData, projectId } = useData();

  const { user } = useAuth();

  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [role, setRole] = useState<Role | undefined>(undefined);
  const [tasksAssignedToUser, setTasksAssignedToUser] = useState<TaskData[]>(
    []
  );

  useEffect(() => {
    (async () => {
      if (projectId && user) {
        setLoading(true);

        try {
          const fetchedRole = await getUserRoleInProject(user.uid, projectId);
          const fetchedTasks = await getTasksForUserInProject(
            user.uid,
            projectId
          );

          setRole(fetchedRole);
          setTasksAssignedToUser(fetchedTasks);
        } catch (error) {
          console.error("Failed to fetch data:", error);
          toast.error("Something went wrong. Please try again later.");
          throw error;
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [projectData, projectId, user]);

  return (
    <div className="w-full h-full flex flex-col">
      {loading && (
        <div className="loading-parent">
          <AiOutlineLoading className="text-white text-6xl animate-spin" />
        </div>
      )}

      <div className="flex flex-col space-y-4 md:space-y-6 p-4 md:p-8 lg:px-12 xl:px-16 divide-y-2 divide-[gray]">
        <h1
          className={`${kanit.className} text-2xl md:text-3xl lg:text-4xl text-[gray] flex flex-col md:items-end md:flex-row`}
        >
          <span className="text-4xl md:text-5xl lg:text-6xl font-medium text-white pr-3 text-center md:text-left">
            {projectData?.name && projectData.name.length > 10
              ? projectData?.name.slice(0, 10) + "..."
              : projectData?.name}
          </span>
          <span className="text-center md:text-left">Tasks</span>
        </h1>

        <div className="w-full h-full flex flex-col space-y-4 pt-4 md:pt-6">
          <div className="flex flex-row justify-between items-center">
            <p className="lg:text-lg">
              {role === "member"
                ? "You are a member, and cannot create or modify tasks."
                : `You are ${
                    role === "owner" ? "the owner" : "a mentor"
                  }, and can create and modify tasks.`}
            </p>
            {role !== "member" && (
              <Link
                href={"/tasks/new"}
                className={`${
                  loading ? "button-disabled" : "button-primary"
                } !w-auto !py-2`}
              >
                Create Task
              </Link>
            )}
          </div>

          <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
            <h2 className="text-xl md:text-2xl">Your Tasks</h2>

            {tasksAssignedToUser?.length ? (
              <div className="flex flex-col space-y-2 pt-2">
                {tasksAssignedToUser.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-60 md:h-72 lg:h-96">
                <p className="text-[gray] text-lg">
                  You have no tasks assigned to you.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksViewPage;
