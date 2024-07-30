"use client";

import { ref, get, child, set } from "firebase/database";
import { db } from "@/firebase";

import { ProjectData, Role, UserProjectStatus } from "@/typings";
import { getUserProjects, setUserProjects } from "./users";

export const getMembers = async (pid: string): Promise<string[]> => {
  if (!(await hasMembers(pid))) {
    return [];
  }

  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects/${pid}/members`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get members");
  }
};

export const getMemberNames = async (pid: string): Promise<string[]> => {
  const members = await getMembers(pid);

  const memberNamesPromises = members.map(async (uid) => {
    const snapshot = await get(child(ref(db), `users/${uid}/name`));
    return snapshot.val();
  });

  return Promise.all(memberNamesPromises);
};

export const updateUserProjects = async (
  uid: string,
  role: Role,
  projectData: ProjectData
) => {
  try {
    const snapshot = await get(child(ref(db), `users/${uid}/projects`));

    let userProjects: UserProjectStatus[];

    if (snapshot.exists()) {
      userProjects = snapshot.val();
    } else {
      userProjects = [];
    }

    userProjects.push({
      id: projectData.id,
      name: projectData.name,
      role: role,
    });

    await set(ref(db, `users/${uid}/projects`), userProjects);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getProject = async (pid: string): Promise<ProjectData> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects/${pid}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("Project does not exist");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const doesProjectExist = async (pid: string): Promise<boolean> => {
  try {
    const snapshot = await get(child(ref(db), `projects/${pid}`));
    return snapshot.exists();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to check if project exists");
  }
};

export const createProject = async (
  projectData: ProjectData
): Promise<"success" | "failed"> => {
  try {
    await set(ref(db, `projects/${projectData.id}`), projectData);

    // Update owner projects
    await updateUserProjects(projectData.owner, "owner", projectData);

    // Update member projects
    const memberPromises = projectData.members.map((uid) =>
      updateUserProjects(uid, "member", projectData)
    );
    await Promise.all(memberPromises);

    // Update mentor projects
    const mentorPromises = projectData.mentors.map((uid) =>
      updateUserProjects(uid, "mentor", projectData)
    );
    await Promise.all(mentorPromises);

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

export const updateProject = (
  projectData: ProjectData
): "success" | "failed" => {
  try {
    set(ref(db, `projects/${projectData.id}`), projectData);

    return "success";
  } catch (error) {
    console.error(error);
    return "failed";
  }
};

export const deleteProject = async (pid: string): Promise<void> => {
  try {
    const projectData = await getProject(pid);

    if (!projectData) {
      throw new Error("Project does not exist");
    }

    const memberPromises = projectData.members.map((uid) =>
      leaveProject(pid, uid)
    );
    await Promise.all(memberPromises);

    const mentorPromises = projectData.mentors.map((uid) =>
      leaveProject(pid, uid)
    );
    await Promise.all(mentorPromises);

    const ownerProjects: UserProjectStatus[] = await getUserProjects(
      projectData.owner
    );
    const index = ownerProjects.findIndex((project) => project.id === pid);

    if (index > -1) {
      ownerProjects.splice(index, 1);
      setUserProjects(projectData.owner, ownerProjects);
    } else {
      throw new Error("Owner does not have project in their projects");
    }

    await set(ref(db, `projects/${pid}`), null);
  } catch (error: any) {
    console.error(error);
    throw new Error(`Failed to delete project: ${error.message}`);
  }
};

export const hasMembers = async (pid: string): Promise<boolean> => {
  try {
    const snapshot = await get(child(ref(db), `projects/${pid}/members`));
    return snapshot.exists();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to check if project has members");
  }
};

export const getOwner = async (pid: string): Promise<string> => {
  try {
    const snapshot = await get(child(ref(db), `projects/${pid}/owner`));
    return snapshot.val();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get project owner");
  }
};

export const leaveProject = async (pid: string, uid: string): Promise<void> => {
  try {
    const projectData = await getProject(pid);

    if (!projectData) {
      throw new Error("Project does not exist");
    }

    const userProjects: UserProjectStatus[] = await getUserProjects(uid);
    const index = userProjects.findIndex((project) => project.id === pid);

    if (index > -1) {
      userProjects.splice(index, 1);
      setUserProjects(uid, userProjects);
    } else {
      throw new Error("User does not have project in their projects");
    }

    if (projectData.owner === uid) {
      throw new Error("Owner cannot leave project");
    }

    await set(
      ref(db, `projects/${pid}/members`),
      projectData.members.filter((member) => member !== uid)
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to leave project");
  }
};

export const transferOwnership = async (
  pid: string,
  newOwner: string
): Promise<void> => {
  try {
    const oldOwner = await getOwner(pid);

    await set(ref(db, `projects/${pid}/owner`), newOwner);
    await set(ref(db, `projects/${pid}/members/${oldOwner}`), null);
    await set(ref(db, `projects/${pid}/members/${newOwner}`), true);

    const newOwnerProjects: UserProjectStatus[] = await getUserProjects(
      newOwner
    );
    const newOwnerIndex = newOwnerProjects.findIndex(
      (project) => project.id === pid
    );

    if (newOwnerIndex > -1) {
      newOwnerProjects[newOwnerIndex].role = "owner";
      setUserProjects(newOwner, newOwnerProjects);
    } else {
      throw new Error("New owner does not have project in their projects");
    }

    const oldOwnerProjects: UserProjectStatus[] = await getUserProjects(
      oldOwner
    );
    const oldOwnerIndex = oldOwnerProjects.findIndex(
      (project) => project.id === pid
    );

    if (oldOwnerIndex > -1) {
      oldOwnerProjects[oldOwnerIndex].role = "member";
      setUserProjects(oldOwner, oldOwnerProjects);
    } else {
      throw new Error("Old owner does not have project in their projects");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to transfer ownership");
  }
};
