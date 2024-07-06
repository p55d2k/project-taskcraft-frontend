"use client";

import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";

import {
  DatabaseReference,
  onValue,
  ref,
  remove,
  update,
} from "firebase/database";
import { db } from "@/firebase";

import { ProjectData, UserData } from "@/typings";

interface IDataContext {
  userData: UserData | null;
  projectData: ProjectData | null;
  projectId: string;
  setProjectId: (id: string) => void;
  setUserData: (data: UserData) => void;
  deleteUserData: () => void;
  setProjectData: (data: ProjectData) => void;
  deleteProjectData: () => void;
}

const DataContext = createContext<IDataContext>({
  userData: null,
  projectData: null,
  projectId: "",
  setProjectId: () => {},
  setUserData: () => {},
  deleteUserData: () => {},
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

  const { user } = useAuth();

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
      update(projectDocRef, projectData);
    }
  }, [projectData]);

  const setUserData = (data: UserData) => {
    if (!userId) return;
    setUserDataLocally(data);
  };

  const deleteUserData = () => {
    if (!userId) return;
    setUserDataLocally(null);
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
        deleteUserData,
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
