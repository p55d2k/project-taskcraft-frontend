import { formatDate } from "@/lib/utils";
import { getTask } from "./tasks";
import { ProjectData, TaskData } from "@/types";

export const formatTaskData = async (taskData: TaskData): Promise<string> => {
  return `Task: ${taskData.description}, Status: ${
    taskData.status
  }, Priority: ${taskData.priority}, Assigned To: ${taskData.assignedTo.join(
    ", "
  )}, Assigned By: ${taskData.assignedBy}, Created At: ${formatDate(
    taskData.createdAt
  )}, Completed At: ${
    taskData.completedAt === 0
      ? "Not Completed Yet"
      : formatDate(taskData.completedAt)
  }, Due Date: ${formatDate(taskData.dueDate)}`;
};

export const formatProjectData = async (
  projectData: ProjectData
): Promise<string> => {
  let tasks_progress: string[];
  let tasks_completed: string[];
  let tasks_overdue: string[];

  if (!projectData.tasks_progress) {
    tasks_progress = ["None"];
  } else {
    tasks_progress = await Promise.all(
      projectData.tasks_progress.map(async (task) =>
        formatTaskData(await getTask(task))
      )
    );
  }

  if (!projectData.tasks_completed) {
    tasks_completed = ["None"];
  } else {
    tasks_completed = await Promise.all(
      projectData.tasks_completed.map(async (task) =>
        formatTaskData(await getTask(task))
      )
    );
  }

  if (!projectData.tasks_overdue) {
    tasks_overdue = ["None"];
  } else {
    tasks_overdue = await Promise.all(
      projectData.tasks_overdue.map(async (task) =>
        formatTaskData(await getTask(task))
      )
    );
  }

  return `Project: ${projectData.name}, Chat: ${projectData.chat}, Owner: ${
    projectData.owner
  }, Members: ${projectData.members.join(", ")}, ${
    projectData.mentors && projectData.mentors.length > 0
      ? `Mentors: ${projectData.mentors.join(", ")}`
      : "Mentors: None"
  }, Tasks Progress: ${tasks_progress.join(
    ", "
  )}, Tasks Completed: ${tasks_completed.join(
    ", "
  )}, Tasks Overdue: ${tasks_overdue.join(", ")}`;
};
