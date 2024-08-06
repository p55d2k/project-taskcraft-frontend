"use client";

import useData from "@/hooks/useData";
import { useUser } from "@clerk/nextjs";

import {
  getAllTasks,
  getCompletedTasksAssignedToUser,
  getTasksAssignedByUser,
  getTasksAssignedToUser,
  updateTasksIfOverdue,
} from "@/utils/tasks";
import { kanit } from "@/utils/fonts";
import { getUserRoleInProject } from "@/utils/users";

import TaskCard from "@/components/tasks/Card";
import Loading from "@/components/Loading";

import { Role, TaskData } from "@/types";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { useEffect, useState } from "react";
import Link from "next/link";

import toast from "react-hot-toast";

const TasksViewPage = () => {
  const { projectData, projectId } = useData();

  const { user } = useUser();

  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [role, setRole] = useState<Role | undefined>(undefined);

  const [tasksAssignedToUser, setTasksAssignedToUser] = useState<TaskData[]>(
    []
  );
  const [tasksCompletedByUser, setTasksCompletedByUser] = useState<TaskData[]>(
    []
  );
  const [tasksAssignedByUser, setTasksAssignedByUser] = useState<TaskData[]>(
    []
  );
  const [allOtherTasks, setAllOtherTasks] = useState<TaskData[]>([]);

  useEffect(() => {
    (async () => {
      if (projectId && user) {
        setLoading(true);

        try {
          const fetchedRole = await getUserRoleInProject(
            user.username!,
            projectId
          );
          const fetchedTasks = await getTasksAssignedToUser(
            user.username!,
            projectId
          );
          const fetchedCompletedTasks = await getCompletedTasksAssignedToUser(
            user.username!,
            projectId
          );
          const fetchedAssignedTasks = await getTasksAssignedByUser(
            user.username!,
            projectId
          );
          const allOtherTasks = await getAllTasks(projectId);

          setRole(fetchedRole);

          setTasksAssignedToUser(fetchedTasks);
          setTasksCompletedByUser(fetchedCompletedTasks);
          setTasksAssignedByUser(fetchedAssignedTasks);
          setAllOtherTasks(
            allOtherTasks.filter(
              (task) =>
                !fetchedTasks.includes(task) &&
                !fetchedCompletedTasks.includes(task) &&
                !fetchedAssignedTasks.includes(task)
            )
          );

          await updateTasksIfOverdue(projectId);
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
      <Loading loading={loading} />

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

        <div className="w-full h-full flex flex-col space-y-4 pt-4">
          <div className="flex flex-row justify-between items-center">
            <p className="lg:text-lg pr-2">
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
                } !w-auto !py-2 text-center`}
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
              <div className="flex flex-col items-center justify-center h-48 md:h-60 lg:h-72">
                <p className="text-[gray] text-lg">
                  You have no tasks assigned to you.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
            <h2 className="text-xl md:text-2xl">Tasks You Completed</h2>

            {tasksCompletedByUser?.length ? (
              <div className="flex flex-col space-y-2 pt-2">
                {tasksCompletedByUser.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 md:h-60 lg:h-72">
                <p className="text-[gray] text-lg">
                  You have not completed any tasks yet...
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
            <h2 className="text-xl md:text-2xl">Tasks You Assigned</h2>

            {role !== "member" && tasksAssignedByUser?.length ? (
              <div className="flex flex-col space-y-2 pt-2">
                {tasksAssignedByUser.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 md:h-60 lg:h-72">
                <p className="text-[gray] text-lg">
                  You have not assigned any tasks.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
            <h2 className="text-xl md:text-2xl">All Other Tasks</h2>

            {allOtherTasks?.length ? (
              <div className="flex flex-col space-y-2 pt-2">
                {allOtherTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 md:h-60 lg:h-72">
                <p className="text-[gray] text-lg">
                  There are no other tasks in this project.
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
