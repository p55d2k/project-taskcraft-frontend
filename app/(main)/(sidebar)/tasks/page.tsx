"use client";

import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import { navigate } from "@/utils/actions";
import { getTasksForUserInProject } from "@/utils/tasks";
import { kanit } from "@/utils/fonts";
import { getUserRoleInProject } from "@/utils/users";

import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react";

import { TaskData } from "@/typings";

import Link from "next/link";

const Dashboard = () => {
  const { projectData, projectId } = useData();
  if (!projectData || !projectId) navigate("/projects");

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<"owner" | "member" | "mentor" | undefined>(
    undefined
  );
  const [tasksAssignedToUser, setTasksAssignedToUser] = useState<TaskData[]>(
    []
  );

  useEffect(() => {
    (async () => {
      if (projectId && user) {
        setRole(await getUserRoleInProject(user.uid, projectId));
        setTasksAssignedToUser(
          await getTasksForUserInProject(user.uid, projectId)
        );
      }
    })();
  }, [projectData, projectId]);

  useEffect(() => {
    if (!role || !projectData || !projectId) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [role, projectId, projectData]);

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <AiOutlineLoading className="text-white text-6xl animate-spin" />
        </div>
      )}

      <div className="flex flex-col space-y-4 md:space-y-6 p-4 md:p-8 lg:px-12 xl:px-16 divide-y-2 divide-[gray]">
        <h1
          className={`${kanit.className} text-2xl md:text-3xl lg:text-4xl text-[gray]`}
        >
          <span className="text-4xl md:text-5xl lg:text-6xl font-medium text-white pr-3">
            {projectData?.name}
          </span>
          Tasks
        </h1>

        <div className="w-full h-full flex flex-col space-y-4 pt-4 md:pt-6">
          <div className="flex flex-row justify-between items-center">
            <p className="lg:text-lg">
              {role === "member"
                ? "You are a member, and cannot create or modify tasks."
                : `You are a ${role}, and can create and modify tasks.`}
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
          {tasksAssignedToUser.length > 0 && (
            <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
              <h2 className="text-xl md:text-2xl ">Your Tasks</h2>

              <div className="flex flex-col space-y-2 pt-2">
                {tasksAssignedToUser.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col space-y-2 p-2 md:p-4 rounded bg-[#1c1c1c]"
                  >
                    <h3 className="text-lg md:text-xl">
                      {task.description.length > 25
                        ? task.description.slice(0, 25) + "..."
                        : task.description}
                    </h3>

                    <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
                      <span className="text-[gray] text-sm md:text-base">
                        Status: {task.status}
                      </span>

                      <span className="text-[gray] text-sm md:text-base">
                        Priority: {task.priority}
                      </span>

                      <span className="text-[gray] text-sm md:text-base">
                        Due:{" "}
                        {new Date(task.dueDate).toLocaleDateString("en-US")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
