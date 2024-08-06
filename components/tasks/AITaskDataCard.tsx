"use client";

import { formatDate } from "@/lib/utils";
import { TaskData } from "@/types";

const AITaskDataCard = ({ taskData }: { taskData: TaskData }) => {
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
          <span>{formatDate(taskData.dueDate)}</span>
        </div>
        <div className="flex flex-row space-x-1">
          <span className="font-semibold text-blue-500">Assigned To: </span>
          <span>{taskData.assignedTo.join(", ")}</span>
        </div>
      </div>
    </div>
  );
};

export default AITaskDataCard;
