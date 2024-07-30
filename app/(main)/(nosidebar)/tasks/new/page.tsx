"use client";

import NewTaskPage1 from "@/components/tasks/NewTaskPage1";
import NewTaskPage2 from "@/components/tasks/NewTaskPage2";
import NewTaskPage3 from "@/components/tasks/NewTaskPage3";
import Loading from "@/components/Loading";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { getUserRoleInProject } from "@/utils/users";
import { generateUniqueId } from "@/utils/unique";
import { createTask } from "@/utils/tasks";
import { navigate } from "@/utils/actions";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { TaskData, Role } from "@/typings";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

const NewTask = () => {
  const { user } = useAuth();
  const { projectData, projectId } = useData();

  if (!projectData || !projectId) navigate("/projects");

  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [assignedTo, setAssignedTo] = useState<string[]>([""]);
  const [dueDate, setDueDate] = useState<number>(Date.now());

  const [tryCreate, setTryCreate] = useState<boolean>(false);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setLoading(true);

      const role: Role | undefined = await getUserRoleInProject(
        user.uid,
        projectId
      );

      if (!role || role === "member") {
        navigate("/tasks");
      }

      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!tryCreate || !user) return;

    (async () => {
      setLoading(true);

      const taskData: TaskData = {
        id: generateUniqueId(),
        project: projectId,
        description: description,
        status: "progress",
        priority: priority,

        assignedTo: assignedTo,
        assignedBy: user.uid,

        createdAt: Date.now(),
        completedAt: 0,
        dueDate: dueDate,
      };

      console.log("Task data", taskData);

      await createTask(taskData, projectId)
        .then(() => {
          setLoading(false);
          setTryCreate(false);

          toast.success("Task created successfully!");
          navigate("/tasks");
        })
        .catch((error) => {
          setLoading(false);
          setTryCreate(false);

          toast.error("Something went wrong. Please try again later.");
          console.error("Failed to create task", error);
        });
    })();
  }, [tryCreate]);

  const setNext = () => {
    if (page === 1) {
      if (!description) setError("Please fill in the description");
    } else if (page === 3) {
      setTryCreate(true);
    }

    setPage(page + 1);
    setError("");
  };

  const goBack = () => {
    setPage(page - 1);
    setError("");
  };

  return (
    <div className="w-screen h-screen">
      <Loading loading={loading} />

      {page === 1 ? (
        <NewTaskPage1
          description={description}
          setDescription={setDescription}
          priority={priority}
          setPriority={setPriority}
          error={error}
          setNext={setNext}
        />
      ) : page === 2 ? (
        <NewTaskPage2
          assignedTo={assignedTo}
          setAssignedTo={setAssignedTo}
          error={error}
          setError={setError}
          goBack={goBack}
          setNext={setNext}
        />
      ) : (
        <NewTaskPage3
          date={dueDate}
          setDate={setDueDate}
          error={error}
          setError={setError}
          goBack={goBack}
          setNext={setNext}
        />
      )}
    </div>
  );
};

export default NewTask;
