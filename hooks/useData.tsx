"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  DatabaseReference,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { db } from "@/firebase";

import { ProjectData, UserData } from "@/types";
import { noProjectRoutes, needProjectRoutes } from "@/constants/routes";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { useUser } from "@clerk/nextjs";

interface IDataContext {
  userData: UserData | null;
  projectData: ProjectData | null;
  projectId: string;
  setProjectId: (id: string) => void;
  setUserData: (data: UserData) => void;
  setProjectData: (data: ProjectData) => void;
  deleteProjectData: () => void;
}

const DataContext = createContext<IDataContext>({
  userData: null,
  projectData: null,
  projectId: "",
  setProjectId: () => {},
  setUserData: () => {},
  setProjectData: () => {},
  deleteProjectData: () => {},
});

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [userData, setUserDataLocally] = useState<UserData | null>(null);
  const [userDocRef, setUserDocRef] = useState<DatabaseReference | null>(null);

  const [projectId, setProjectId] = useState<string>("");
  const [projectData, setProjectDataLocally] = useState<ProjectData | null>(
    null
  );
  const [projectDocRef, setProjectDocRef] = useState<DatabaseReference | null>(
    null
  );

  const [loading, setLoading] = useRecoilState(loadingAtom);

  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    setLoading(true);

    let path_allowed = true;
    for (const path of needProjectRoutes) {
      if (pathname.startsWith(path)) {
        path_allowed = false;
        break;
      }
    }

    (async () => {
      if (
        (!projectId || !projectData) &&
        !path_allowed &&
        isSignedIn &&
        isLoaded
      ) {
        toast.error("Please select a project to continue");
        router.push(`/projects?continue=${pathname}`);
      }

      setLoading(false);
    })();
  }, [pathname, projectId, projectData, isSignedIn, isLoaded]);

  useEffect(() => {
    if (!user) return;

    const currentUsername = user.username;
    const currentDocRef = ref(db, `users/${currentUsername}`);

    setUserDocRef(currentDocRef);

    const unsubscribe = onValue(currentDocRef, (snapshot) => {
      const data = snapshot.val();
      setUserDataLocally(data);
    });

    // cleanup function to unsubscribe
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user?.username || !userDocRef) return;

    if (!userData) {
      remove(userDocRef);
      setUserDocRef(null);
    } else {
      update(userDocRef, userData);
    }
  }, [userData]);

  useEffect(() => {
    if (!projectId || !user?.username) return;

    const currentProjectDocRef = ref(db, `projects/${projectId}`);

    setProjectDocRef(currentProjectDocRef);

    const unsubscribe = onValue(currentProjectDocRef, (snapshot) => {
      const data = snapshot.val();
      setProjectDataLocally(data);

      if (
        !data?.members?.includes(user.username) &&
        !data?.mentors?.includes(user.username) &&
        data?.owner !== user.username
      ) {
        setProjectDataLocally(null);
        setProjectId("");

        toast.error("You are not a part of this project");
        router.push("/projects");
      }
    });

    // cleanup function to unsubscribe
    return () => unsubscribe();
  }, [projectId]);

  useEffect(() => {
    if (!projectId || !projectDocRef) return;

    if (!projectData) {
      remove(projectDocRef);
      setProjectDocRef(null);
    } else {
      if (projectData.id !== projectId) {
        console.error("Project ID mismatch");
        toast.error("Something went wrong. Please try again later.");
        router.push("/projects");
        return;
      }

      update(projectDocRef, projectData);
    }
  }, [projectData]);

  const setUserData = (data: UserData) => {
    if (!user?.username) return;
    setUserDataLocally(data);
  };

  const setProjectData = (data: ProjectData) => {
    if (!projectId) return;
    setProjectDataLocally(data);
  };

  const deleteProjectData = () => {
    if (!projectId) return;
    setProjectDataLocally(null);
  };

  return (
    <DataContext.Provider
      value={{
        userData,
        projectData,
        projectId,
        setProjectId,
        setUserData,
        setProjectData,
        deleteProjectData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default function useData() {
  return useContext(DataContext);
}
