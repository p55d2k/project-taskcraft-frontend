"use client";

import { ref, get, child, remove, set } from "firebase/database";
import { db } from "@/firebase";

import {
  deleteProject,
  getMembers,
  hasMembers,
  leaveProject,
  transferOwnership,
} from "./projects";
import { UserProjectStatus } from "@/typings";

export const doesUserExist = async (uid: string): Promise<boolean> => {
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `users/${uid}`));
    return snapshot.exists();
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const isOwner = async (uid: string, pid: string): Promise<boolean> => {
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `projects/${pid}`));
    if (snapshot.exists()) {
      return snapshot.val().owner === uid;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteAccountData = async (uid: string): Promise<void> => {
  const dbRef = ref(db);

  try {
    const projectsSnapshot = await get(child(dbRef, `users/${uid}/projects`));

    if (projectsSnapshot.exists()) {
      const projects = projectsSnapshot.val();
      const projectPromises = [];

      for (const project in projects) {
        const projectPromise = (async () => {
          try {
            if (projects[project].role === "owner") {
              if (await hasMembers(project)) {
                await transferOwnership(
                  project,
                  (
                    await getMembers(project)
                  )[0]
                );
                await leaveProject(project, uid);
              } else {
                await deleteProject(project);
              }
            } else {
              await leaveProject(project, uid);
            }
          } catch (projectError) {
            console.error(`Error handling project ${project}:`, projectError);
          }
        })();
        projectPromises.push(projectPromise);
      }

      await Promise.all(projectPromises);
    }

    await remove(child(dbRef, `users/${uid}`));
  } catch (error) {
    console.error("Error deleting account data:", error);
    throw error;
  }
};

export const getUserProjects = async (
  uid: string
): Promise<UserProjectStatus[]> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${uid}/projects`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user projects");
  }
};

export const getUserProjectStatus = async (
  uid: string,
  projectId: string
): Promise<UserProjectStatus | null> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${uid}/projects`));

    if (snapshot.exists()) {
      const projects: UserProjectStatus[] = snapshot.val();
      return projects.find((project) => project.id === projectId) || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user project status");
  }
};

export const getUserRoleInProject = async (
  uid: string,
  projectId: string
): Promise<"owner" | "member" | "mentor" | undefined> => {
  try {
    const data = await getUserProjectStatus(uid, projectId);
    return data?.role;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user role in project");
  }
};

export const setUserProjects = async (
  uid: string,
  projects: UserProjectStatus[]
): Promise<void> => {
  try {
    const dbRef = ref(db);
    await remove(child(dbRef, `users/${uid}/projects`));
    await set(child(dbRef, `users/${uid}/projects`), projects);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to set user projects");
  }
};

export const isUserInProject = async (
  uid: string,
  projectId: string
): Promise<boolean> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects/${projectId}/members`));

    if (snapshot.exists()) {
      return Object.keys(snapshot.val()).includes(uid);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to check if user is in project");
  }
};
