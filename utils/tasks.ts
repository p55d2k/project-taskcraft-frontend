"use client";

import { ref, get, child, set } from "firebase/database";
import { db } from "@/firebase";

import { TaskData } from "@/typings";

export const getTask = (tid: string): TaskData | null => {
  let taskData: TaskData | null = null;
  const dbRef = ref(db);

  get(child(dbRef, `tasks/${tid}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        taskData = snapshot.val();
      }
    })
    .catch((error) => {
      console.error(error);
    });

  return taskData;
};

export const createTask = (taskData: TaskData): "success" | "failed" => {
  try {
    set(ref(db, `tasks/${taskData.id}`), taskData);

    taskData.assignedTo.forEach((uid: string) => {
      get(child(ref(db), `users/${uid}/tasks`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const userTasks = snapshot.val();
            userTasks.push(taskData.id);

            set(ref(db, `users/${uid}/tasks`), userTasks);
          } else {
            set(ref(db, `users/${uid}/tasks`), [taskData.id]);
          }
        })
        .catch((error) => {
          console.error(error);
          return "failed";
        });
    });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

export const updateTask = (taskData: TaskData): "success" | "failed" => {
  try {
    set(ref(db, `tasks/${taskData.id}`), taskData);

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

export const deleteTask = (tid: string): "success" | "failed" => {
  try {
    get(child(ref(db), `tasks/${tid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const taskData = snapshot.val();

          taskData.assignedTo.forEach((uid: string) => {
            get(child(ref(db), `users/${uid}/tasks`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const userTasks = snapshot.val();
                  const index = userTasks.indexOf(tid);
                  userTasks.splice(index, 1); // remove task id from user's tasks

                  set(ref(db, `users/${uid}/tasks`), userTasks);
                }
              })
              .catch((error) => {
                console.error(error);
                return "failed";
              });
          });

          set(ref(db, `tasks/${tid}`), null);
        }
      })
      .catch((error) => {
        console.error(error);
        return "failed";
      });

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};
