"use client";

import { navigate } from "@/actions/navigate";
import Loading from "@/components/Loading";
import { db } from "@/firebase";
import { UserData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { child, ref, set } from "firebase/database";
import { useEffect } from "react";

const NewAccount = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    (async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        const dbRef = ref(db);
        await set(child(dbRef, `users/${user.username}`), {
          name: user.fullName,
          email: user.emailAddresses[0].emailAddress,
          imageUrl: user.imageUrl || "",
          createdAt: Date.now(),
          projects: [],
        } as UserData);
        navigate("/projects");
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create new user");
      }
    })();
  }, [user, isLoaded, isSignedIn]);

  return <Loading loading />;
};

export default NewAccount;
