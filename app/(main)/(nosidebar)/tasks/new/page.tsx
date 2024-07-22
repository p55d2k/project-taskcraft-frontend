"use client";

import NewTaskPage1 from "@/components/tasks/NewTaskPage1";
import NewTaskPage2 from "@/components/tasks/NewTaskPage2";
import NewTaskPage3 from "@/components/tasks/NewTaskPage3";

import { AiOutlineLoading } from "react-icons/ai";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { generateUniqueId } from "@/utils/unique";
import { createTask } from "@/utils/tasks";
import { navigate } from "@/utils/actions";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { TaskData } from "@/typings";

const NewProject = () => {
  const { user } = useAuth();
  const { projectData, projectId } = useData();

  if (!projectData || !projectId) navigate("/projects");

  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
  const [assignedTo, setAssignedTo] = useState<string[]>([""]);
  const [dueDate, setDueDate] = useState<number>(Date.now());

  const [tryCreate, setTryCreate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!tryCreate) return;

    async function attemptCreateTask() {
      if (!user) return;

      setLoading(true);

      const taskData: TaskData = {
        id: generateUniqueId(),
        description: description,
        status: "progress",
        priority: priority,

        assignedTo: assignedTo,
        assignedBy: user.uid,

        createdAt: Date.now(),
        dueDate: dueDate,
      };

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
    }

    attemptCreateTask();
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
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <AiOutlineLoading className="text-white text-6xl animate-spin" />
        </div>
      )}

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
        // <NewTaskPage3
        //   error={error}
        //   goBack={goBack}
        //   setNext={setNext}
        // />
        <div></div>
      )}
    </div>
  );
};

export default NewProject;
