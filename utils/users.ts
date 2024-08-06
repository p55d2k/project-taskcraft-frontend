"use client";

import { ref, get, child, remove, set } from "firebase/database";
import { db } from "@/firebase";

import {
  deleteProject,
  getMembers,
  hasMembers,
  memberLeaveProject,
  transferOwnership,
} from "./projects";
import { Role, UserData, UserProjectStatus } from "@/types";

export const doesUserExist = async (name: string): Promise<boolean> => {
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `users/${name.toLowerCase()}`));
    return snapshot.exists();
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteAccountData = async (name: string): Promise<void> => {
  const dbRef = ref(db);

  try {
    const projectsSnapshot = await get(child(dbRef, `users/${name}/projects`));

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
                await memberLeaveProject(project, name);
              } else {
                await deleteProject(project);
              }
            } else {
              await memberLeaveProject(project, name);
            }
          } catch (projectError) {
            console.error(`Error handling project ${project}:`, projectError);
          }
        })();
        projectPromises.push(projectPromise);
      }

      await Promise.all(projectPromises);
    }

    await remove(child(dbRef, `users/${name}`));
  } catch (error) {
    console.error("Error deleting account data:", error);
    throw error;
  }
};

export const getUserProjects = async (
  name: string
): Promise<UserProjectStatus[]> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${name}/projects`));

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
  name: string,
  projectId: string
): Promise<UserProjectStatus | null> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${name}/projects`));

    if (snapshot.exists()) {
      const projects: UserProjectStatus[] = snapshot.val();
      return (
        projects.find((project) => project?.id || "" === projectId) || null
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user project status");
  }
};

export const getUserRoleInProject = async (
  name: string,
  projectId: string
): Promise<Role | undefined> => {
  try {
    const data = await getUserProjectStatus(name.toLowerCase(), projectId);
    return data?.role;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user role in project");
  }
};

export const setUserProjects = async (
  name: string,
  projects: UserProjectStatus[]
): Promise<void> => {
  try {
    const dbRef = ref(db);
    await remove(child(dbRef, `users/${name}/projects`));
    await set(child(dbRef, `users/${name}/projects`), projects);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to set user projects");
  }
};

export const isUserMemberOfProject = async (
  name: string,
  projectId: string
): Promise<boolean> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects/${projectId}/members`));

    if (snapshot.exists()) {
      return snapshot.val().includes(name);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to check if user is in project");
  }
};

export const isUserOwnerOfProject = async (
  name: string,
  pid: string
): Promise<boolean> => {
  const dbRef = ref(db);

  try {
    const snapshot = await get(child(dbRef, `projects/${pid}`));
    if (snapshot.exists()) {
      return snapshot.val().owner === name;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const isUserMentorOfProject = async (
  name: string,
  projectId: string
): Promise<boolean> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects/${projectId}/mentors`));

    if (snapshot.exists()) {
      return snapshot.val().includes(name);
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to check if user is in project");
  }
};

export const isUserPartOfProject = async (
  name: string,
  projectId: string
): Promise<boolean> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${name}/projects`));

    if (snapshot.exists()) {
      let inProject = false;

      snapshot.val().forEach((project: UserProjectStatus) => {
        if (project.id === projectId) inProject = true;
      });

      return inProject;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to check if user is part of project");
  }
};

export const getUserEmails = async (names: string[]): Promise<string[]> => {
  try {
    const dbRef = ref(db);
    const emailPromises = names.map(async (name) => {
      const snapshot = await get(child(dbRef, `users/${name}/email`));
      return snapshot.val();
    });

    return await Promise.all(emailPromises);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user emails");
  }
};

export const getUserData = async (name: string): Promise<UserData> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `users/${name.toLowerCase()}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user data");
  }
};
