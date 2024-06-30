"use client";

// userData: data updated on firestore
// getUserData: get data locally
// setUserData: set data locally
// deleteUserData: delete data locally
// deleteProfileData: delete data locally
// when userData changes, use useEffect to push to firestore so it will update on other devices too

import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";

import { onValue, ref, remove, update } from "firebase/database";
import { db } from "@/firebase";

import { UserData } from "@/typings";

interface IDataContext {
  userData: UserData | null;
  setUserData: (data: any) => void;
  deleteUserData: () => void;
}

const DataContext = createContext<IDataContext>({
  userData: null,
  setUserData: () => {},
  deleteUserData: () => {},
});

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider = ({ children }: DataProviderProps) => {
  const [userData, setUserDataLocally] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");
  const [docRef, setDocRef] = useState<any>(null);

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

    // Cleanup function to unsubscribe
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

  const setUserData = (data: any) => {
    if (!userId) return;
    setUserDataLocally(data);
  };

  const deleteUserData = () => {
    if (!userId) return;
    setUserDataLocally(null);
  };

  return (
    <DataContext.Provider
      value={{
        userData,
        setUserData,
        deleteUserData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default function useData() {
  return useContext(DataContext);
}
