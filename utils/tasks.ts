"use client";

import { ref, get, child, set } from "firebase/database";
import { db } from "@/firebase";

import { TaskData } from "@/typings";

export const getTasksForUserInProject = async (
  uid: string,
  pid: string
): Promise<TaskData[]> => {
  const dbRef = ref(db);
  let tasks: TaskData[] = [];

  try {
    const snapshot = await get(child(dbRef, `projects/${pid}/tasks`));

    if (snapshot.exists()) {
      const projectTasks = snapshot.val();

      for (const task in projectTasks) {
        const taskData = await getTask(task);

        if (taskData.assignedTo.includes(uid)) {
          tasks.push(taskData);
        }
      }
    }

    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getTask = async (tid: string): Promise<TaskData> => {
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `tasks/${tid}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Task not found");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addTaskToProject = async (
  tid: string,
  pid: string
): Promise<void> => {
  try {
    const snapshot = await get(
      child(ref(db), `projects/${pid}/tasks_progress`)
    );

    let tasksInProgress: string[];

    if (snapshot.exists()) {
      tasksInProgress = snapshot.val();
    } else {
      tasksInProgress = [];
    }

    tasksInProgress.push(tid);

    await set(ref(db, `projects/${pid}/tasks_progress`), tasksInProgress);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createTask = async (
  taskData: TaskData,
  projectId: string
): Promise<void> => {
  const dbRef = ref(db);

  try {
    await set(child(dbRef, `tasks/${taskData.id}`), taskData);
    await addTaskToProject(taskData.id, projectId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
