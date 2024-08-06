"use client";

import { ref, get, child, set } from "firebase/database";
import { db } from "@/firebase";

import { ProjectData, TaskData } from "@/types";

export const getTasksAssignedToUser = async (
  name: string,
  pid: string,
  sortByDueDate?: boolean
): Promise<TaskData[]> => {
  const dbRef = ref(db);
  let tasks: TaskData[] = [];

  try {
    const snapshot = await get(child(dbRef, `projects/${pid}/tasks_progress`));

    if (snapshot.exists()) {
      const projectTasks: string[] = snapshot.val();

      const taskPromises = projectTasks.map(async (taskId) => {
        const taskData = await getTask(taskId);

        if (taskData.assignedTo.includes(name)) {
          return taskData;
        }
        return null;
      });

      const resolvedTasks = await Promise.all(taskPromises);
      tasks = resolvedTasks.filter((task): task is TaskData => task !== null);
    }

    if (sortByDueDate) {
      tasks.sort((a, b) => a.dueDate - b.dueDate);
    }

    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getCompletedTasksAssignedToUser = async (
  name: string,
  pid: string
): Promise<TaskData[]> => {
  const dbRef = ref(db);
  let tasks: TaskData[] = [];

  try {
    const snapshot = await get(child(dbRef, `projects/${pid}/tasks_completed`));

    if (snapshot.exists()) {
      const projectTasks: string[] = snapshot.val();

      const taskPromises = projectTasks.map(async (taskId) => {
        const taskData = await getTask(taskId);

        if (taskData.assignedTo.includes(name)) {
          return taskData;
        }
        return null;
      });

      const resolvedTasks = await Promise.all(taskPromises);
      tasks = resolvedTasks.filter((task): task is TaskData => task !== null);
    }

    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const doesTaskExist = async (tid: string): Promise<boolean> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `tasks/${tid}`));

    return snapshot.exists();
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

export const getTasksAssignedByUser = async (
  name: string,
  pid: string
): Promise<TaskData[]> => {
  const dbRef = ref(db);
  let tasks: TaskData[] = [];

  try {
    for (const currentSnapshot of [
      `projects/${pid}/tasks_progress`,
      `projects/${pid}/tasks_completed`,
      `projects/${pid}/tasks_overdue`,
    ]) {
      const snapshot = await get(child(dbRef, currentSnapshot));

      if (snapshot.exists()) {
        const projectTasks: string[] = snapshot.val();

        const taskPromises = projectTasks.map(async (taskId) => {
          const taskData = await getTask(taskId);

          if (taskData.assignedBy === name) {
            return taskData;
          }
          return null;
        });

        const resolvedTasks = await Promise.all(taskPromises);
        tasks = resolvedTasks.filter((task): task is TaskData => task !== null);
      }
    }

    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateTasksIfOverdue = async (
  pid: string
): Promise<TaskData[]> => {
  const dbRef = ref(db);
  let overdueTasks: TaskData[] = [];

  try {
    const snapshot = await get(child(dbRef, `projects/${pid}`));

    if (snapshot.exists()) {
      const projectData: ProjectData = snapshot.val();

      if (!projectData.tasks_progress) {
        return [];
      }

      const taskPromises = projectData.tasks_progress.map(async (taskId) => {
        const taskData = await getTask(taskId);

        if (taskData.dueDate < Date.now()) {
          taskData.status = "overdue";
          await set(child(dbRef, `tasks/${taskId}`), taskData);
          overdueTasks.push(taskData);
        }

        return taskData;
      });

      await Promise.all(taskPromises);

      for (const task of overdueTasks) {
        const taskIndex = projectData.tasks_progress.indexOf(task.id);

        if (taskIndex > -1) {
          projectData.tasks_progress.splice(taskIndex, 1);

          if (!projectData.tasks_overdue) projectData.tasks_overdue = [];
          projectData.tasks_overdue.push(task.id);
        } else {
          throw new Error("Task not found in project");
        }

        await set(child(dbRef, `projects/${pid}`), projectData);
      }

      return overdueTasks;
    }

    throw new Error("Project not found");
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const markTaskAsCompleted = async (tid: string): Promise<void> => {
  const dbRef = ref(db);

  try {
    const taskData: TaskData = await getTask(tid);

    taskData.status = "completed";
    taskData.completedAt = Date.now();

    await set(child(dbRef, `tasks/${tid}`), taskData);

    const projectSnapshot = await get(
      child(dbRef, `projects/${taskData.project}`)
    );

    if (projectSnapshot.exists()) {
      let projectData: ProjectData = projectSnapshot.val();

      const taskIndex = projectData.tasks_progress.indexOf(tid);

      if (taskIndex > -1) {
        projectData.tasks_progress.splice(taskIndex, 1);

        if (!projectData.tasks_completed) projectData.tasks_completed = [];
        projectData.tasks_completed.push(tid);

        await set(child(dbRef, `projects/${taskData.project}`), projectData);
      } else {
        throw new Error("Task not found in project");
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteTask = async (
  tid: string,
  pid: string,
  taskStatus: "overdue" | "completed" | "progress"
): Promise<void> => {
  const dbRef = ref(db);

  try {
    await set(child(dbRef, `tasks/${tid}`), null);

    const projectSnapshot = await get(child(dbRef, `projects/${pid}`));

    if (projectSnapshot.exists()) {
      let projectData: ProjectData = projectSnapshot.val();

      if (taskStatus === "overdue") {
        const taskIndex = projectData.tasks_overdue.indexOf(tid);

        if (taskIndex > -1) {
          projectData.tasks_overdue.splice(taskIndex, 1);
          await set(child(dbRef, `projects/${pid}`), projectData);
        } else {
          throw new Error("Task not found in project");
        }
      } else {
        const taskIndex = projectData.tasks_progress.indexOf(tid);

        if (taskIndex > -1) {
          projectData.tasks_progress.splice(taskIndex, 1);
          await set(child(dbRef, `projects/${pid}`), projectData);
        } else {
          throw new Error("Task not found in project");
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getAllTasks = async (pid: string): Promise<TaskData[]> => {
  const dbRef = ref(db);
  let tasks: TaskData[] = [];

  try {
    const projectSnapshot = await get(child(dbRef, `projects/${pid}`));

    if (!projectSnapshot.exists()) {
      throw new Error("Project not found");
    }

    for (const currentSnapshot of [
      "tasks_progress",
      "tasks_completed",
      "tasks_overdue",
    ]) {
      const snapshot = await get(
        child(dbRef, `projects/${pid}/${currentSnapshot}`)
      );

      if (snapshot.exists()) {
        const projectTasks: string[] = snapshot.val();

        const taskPromises = projectTasks.map(async (taskId) => {
          const taskData = await getTask(taskId);
          return taskData;
        });

        const resolvedTasks = await Promise.all(taskPromises);
        tasks = tasks.concat(resolvedTasks);
      }
    }

    return tasks;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
