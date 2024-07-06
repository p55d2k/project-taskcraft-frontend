"use client";

import { ref, get, child } from "firebase/database";
import { db } from "@/firebase";

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
