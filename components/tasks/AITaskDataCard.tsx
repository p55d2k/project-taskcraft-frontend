"use client";

import { TaskData } from "@/types";
import { nameFromId } from "@/utils/users";
import { useEffect, useState } from "react";

const AITaskDataCard = ({ taskData }: { taskData: TaskData }) => {
  const [names, setNames] = useState<string[]>([]);

  useEffect(() => {
    if (!taskData.assignedTo) return;

    (async () => {
      if (typeof taskData.assignedTo === "string") {
        const fetchedName = await nameFromId(taskData.assignedTo);
        setNames([fetchedName]);
      } else {
        const fetchedNames = await Promise.all(
          taskData.assignedTo.map((id) => nameFromId(id))
        );
        setNames(fetchedNames);
      }
    })();
  }, [taskData]);

  return (
    <div className="bg-dark-1 border-2 rounded-lg p-4 border-[#1f1f1f]">
      <h3 className="font-semibold text-lg">AI-Generated Task</h3>
      <div className="flex flex-col mt-2">
        <div className="flex flex-row space-x-1">
          <span className="font-semibold text-blue-500">Description: </span>
          <span>{taskData.description}</span>
        </div>
        <div className="flex flex-row space-x-1">
          <span className="font-semibold text-blue-500">Priority: </span>
          <span className="capitalize">{taskData.priority}</span>
        </div>
        <div className="flex flex-row space-x-1">
          <span className="font-semibold text-blue-500">Due Date: </span>
          <span>
            {new Date(taskData?.dueDate!).toDateString()}{" "}
            {new Date(taskData?.dueDate!).toLocaleTimeString() || "No due date"}
          </span>
        </div>
        <div className="flex flex-row space-x-1">
          <span className="font-semibold text-blue-500">Assigned To: </span>
          <span>{names.join(", ")}</span>
        </div>
      </div>
    </div>
  );
};

export default AITaskDataCard;
