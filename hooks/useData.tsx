"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

import {
  DatabaseReference,
  onValue,
  ref,
  remove,
  update,
} from "firebase/database";
import { db } from "@/firebase";

import useAuth from "./useAuth";
import { ProjectData, UserData } from "@/types";
import { navigate } from "@/actions/navigate";
import { pageExists } from "@/utils/pathexists";
import { noProjectRoutes } from "@/constants/routes";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";
import { revalidatePath } from "next/cache";

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
  const [userId, setUserId] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");

  const [userData, setUserDataLocally] = useState<UserData | null>(null);
  const [projectData, setProjectDataLocally] = useState<ProjectData | null>(
    null
  );

  const [docRef, setDocRef] = useState<DatabaseReference | null>(null);
  const [projectDocRef, setProjectDocRef] = useState<DatabaseReference | null>(
    null
  );

  const [loading, setLoading] = useRecoilState(loadingAtom);

  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    setLoading(true);

    let path_allowed = false;
    for (const path of noProjectRoutes) {
      if (pathname.startsWith(path)) {
        path_allowed = true;
        break;
      }
    }

    (async () => {
      if (
        (!projectId || !projectData) &&
        !path_allowed &&
        user &&
        pathname !== "/" &&
        (await pageExists(pathname))
      ) {
        toast.error("Please select a project to continue");
        navigate(`/projects?continue=${pathname}`);
      }

      setLoading(false);
    })();
  }, [pathname]);

  useEffect(() => {
    if (!user) return;

    const currentUserId = user.uid;
    const currentDocRef = ref(db, `users/${currentUserId}`);

    setUserId(currentUserId);
    setDocRef(currentDocRef);

    const unsubscribe = onValue(currentDocRef, (snapshot) => {
      const data = snapshot.val();
      setUserDataLocally(data);
    });

    // cleanup function to unsubscribe
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!userId || !docRef) return;

    if (!userData) {
      remove(docRef);
      setDocRef(null);
    } else {
      update(docRef, userData);
    }
  }, [userData]);

  useEffect(() => {
    if (!projectId || !userId) return;

    const currentProjectDocRef = ref(db, `projects/${projectId}`);

    setProjectDocRef(currentProjectDocRef);

    const unsubscribe = onValue(currentProjectDocRef, (snapshot) => {
      const data = snapshot.val();
      setProjectDataLocally(data);

      if (
        !data?.members?.includes(userId) &&
        !data?.mentors?.includes(userId) &&
        data?.owner !== userId
      ) {
        setProjectDataLocally(null);
        setProjectId("");

        toast.error("You are not a part of this project");
        navigate("/projects");
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
        return;
      }

      update(projectDocRef, projectData);
    }
  }, [projectData]);

  const setUserData = (data: UserData) => {
    if (!userId) return;
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
