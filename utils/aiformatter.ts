import { nameFromId } from "./users";
import { getTask } from "./tasks";
import { ProjectData, TaskData } from "@/types";

export const formatTaskData = async (taskData: TaskData): Promise<string> => {
  const assignedTo = await Promise.all(
    taskData.assignedTo.map((user) => nameFromId(user))
  );
  const assignedBy = await nameFromId(taskData.assignedBy);

  return `Task: ${taskData.description}, Status: ${
    taskData.status
  }, Priority: ${taskData.priority}, Assigned To: ${assignedTo.join(
    ", "
  )} with userIDs of ${taskData.assignedTo.join(
    ", "
  )}, Assigned By: ${assignedBy} with userID of ${
    taskData.assignedBy
  }, Created At: ${new Date(
    taskData.createdAt
  ).toLocaleDateString()}, Completed At: ${
    taskData.completedAt === 0
      ? "Not Completed Yet"
      : new Date(taskData.completedAt).toLocaleDateString()
  }, Due Date: ${new Date(taskData.dueDate).toLocaleDateString()}`;
};

export const formatProjectData = async (
  projectData: ProjectData
): Promise<string> => {
  const owner = await nameFromId(projectData.owner);
  const members = await Promise.all(
    projectData.members.map((member) => nameFromId(member))
  );

  let mentors: string[];
  if (!projectData.mentors) {
    mentors = ["None"];
  } else {
    mentors = await Promise.all(
      projectData.mentors.map((mentor) => nameFromId(mentor))
    );
  }

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

  return `Project: ${projectData.name}, Chat: ${
    projectData.chat
  }, Owner: ${owner} with userID of ${
    projectData.owner
  }, Members: ${members.join(", ")} with userIDs of ${projectData.members.join(
    ", "
  )} respectively, ${
    projectData.mentors && projectData.mentors.length > 0
      ? `Mentors: ${mentors.join(
          ", "
        )} with userIDs of ${projectData.mentors.join(", ")} respectively`
      : "Mentors: None"
  }, Tasks Progress: ${tasks_progress.join(
    ", "
  )}, Tasks Completed: ${tasks_completed.join(
    ", "
  )}, Tasks Overdue: ${tasks_overdue.join(", ")}`;
};
