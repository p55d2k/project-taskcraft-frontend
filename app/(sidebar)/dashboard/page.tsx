"use client";

import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import { getUserRoleInProject } from "@/utils/users";
import { getTasksAssignedToUser } from "@/utils/tasks";

import DashboardWrapper from "@/components/DashboardWrapper";
import TaskCard from "@/components/tasks/Card";

import { useEffect, useState } from "react";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { Role, TaskData } from "@/types";

import toast from "react-hot-toast";

const Dashboard = () => {
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
          const fetchedTasks = await getTasksAssignedToUser(
            user.uid,
            projectId,
            true
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
    <DashboardWrapper loading={loading} pageName="Dashboard" role={role}>
      <div className="w-full h-full flex flex-col space-y-4 pt-4 md:pt-6">
        <div className="flex flex-col p-4 md:px-6 rounded space-y-2 bg-[#141414] divide-y-2 divide-[gray]">
          <h2 className="text-xl md:text-2xl">Your Tasks</h2>

          {tasksAssignedToUser.length ? (
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
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
