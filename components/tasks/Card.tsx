import { TaskData } from "@/types";
import Link from "next/link";

interface TaskProps {
  task: TaskData;
}

const TaskCard = ({ task }: TaskProps) => {
  return (
    <Link
      href={`/tasks/${task.id}`}
      className="flex flex-col space-y-2 p-2 md:p-4 rounded bg-[#1c1c1c] hover:border-[gray] border-transparent border-2 transition-all ease-in-out duration-300"
    >
      <h3 className="text-lg md:text-xl text-center md:text-left">
        {task.description.length > 25
          ? task.description.slice(0, 25) + "..."
          : task.description}
      </h3>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <span className="text-[gray] text-sm md:text-base capitalize">
          Status: {task.status}
        </span>

        <span className="text-[gray] text-sm md:text-base capitalize">
          Priority: {task.priority}
        </span>

        <span className="text-[gray] text-sm md:text-base">
          Due:{" "}
          <span>
            {new Date(task.dueDate).toDateString()}{" "}
            {new Date(task.dueDate).toLocaleTimeString() || "No due date"}
          </span>
        </span>
      </div>
    </Link>
  );
};

export default TaskCard;
