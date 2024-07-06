"use client";

import { ref, get, child, set } from "firebase/database";
import { db } from "@/firebase";

import { ProjectData, UserProjectStatus } from "@/typings";

export const getUserProjects = async (
  uid: string
): Promise<UserProjectStatus[] | null> => {
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
    return null;
  }
};

export const getProject = async (pid: string): Promise<ProjectData | null> => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, `projects/${pid}`));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const createProject = async (
  projectData: ProjectData
): Promise<"success" | "failed"> => {
  try {
    await set(ref(db, `projects/${projectData.id}`), projectData);

    const updateUserProjects = async (
      uid: string,
      role: "owner" | "member" | "mentor"
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
        throw new Error("Failed to update user projects");
      }
    };

    // Update owner projects
    await updateUserProjects(projectData.owner, "owner");

    // Update member projects
    const memberPromises = projectData.members.map((uid) =>
      updateUserProjects(uid, "member")
    );
    await Promise.all(memberPromises);

    // Update mentor projects
    const mentorPromises = projectData.mentors.map((uid) =>
      updateUserProjects(uid, "mentor")
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

export const deleteProject = (pid: string): "success" | "failed" => {
  try {
    get(child(ref(db), `projects/${pid}`))
      .then((projectSnapshot) => {
        if (projectSnapshot.exists()) {
          const projectData: ProjectData = projectSnapshot.val();

          projectData.mentors.forEach((uid: string) => {
            get(child(ref(db), `users/${uid}/projects`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const userProjects: UserProjectStatus[] = snapshot.val();
                  const index = userProjects.findIndex(
                    (project) => project.id === pid
                  );
                  userProjects.splice(index, 1); // remove project id from user's projects

                  set(ref(db, `users/${uid}/projects`), userProjects);
                }
              })
              .catch((error) => {
                console.error(error);
                return "failed";
              });
          });

          projectData.members.forEach((uid: string) => {
            get(child(ref(db), `users/${uid}/projects`))
              .then((snapshot) => {
                if (snapshot.exists()) {
                  const userProjects: UserProjectStatus[] = snapshot.val();
                  const index = userProjects.findIndex(
                    (project) => project.id === pid
                  );
                  userProjects.splice(index, 1); // remove project id from user's projects

                  set(ref(db, `users/${uid}/projects`), userProjects);
                }
              })
              .catch((error) => {
                console.error(error);
                return "failed";
              });
          });

          get(child(ref(db), `users/${projectData.owner}/projects`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                const userProjects: UserProjectStatus[] = snapshot.val();
                const index = userProjects.findIndex(
                  (project) => project.id === pid
                );
                userProjects.splice(index, 1); // remove project id from user's projects

                set(
                  ref(db, `users/${projectData.owner}/projects`),
                  userProjects
                );
              }
            })
            .catch((error) => {
              console.error(error);
              return "failed";
            });

          set(ref(db, `projects/${pid}`), null);
        }
      })
      .catch((error) => {
        console.error(error);
        return "failed";
      });
  } catch (error) {
    console.error(error);
    return "failed";
  }

  return "success";
};
