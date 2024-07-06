"use client";

import { useState, useMemo, useEffect, useContext, createContext } from "react";
import { usePathname } from "next/navigation";

import { auth, db } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  updatePassword,
  updateEmail,
  deleteUser,
  signOut,
  User,
} from "firebase/auth";
import { ref, set } from "firebase/database";

import { navigate } from "@/utils/actions";
import { UserData } from "@/typings";

interface IAuth {
  user: User | null;
  signUp: (email: string, password: string, uname: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  deleteAcc: () => Promise<void>;
  changePassword: (password: string) => Promise<void>;
  changeEmail: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  resetPassword: () => Promise<void>;
  error: string | null;
  loading: boolean;
}

const AuthContext = createContext<IAuth>({
  user: null,
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
  deleteAcc: async () => {},
  changePassword: async () => {},
  changeEmail: async () => {},
  verifyEmail: async () => {},
  resetPassword: async () => {},
  error: null,
  loading: false,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

const unprotectedRoutes = ["/auth"];

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const pathname = usePathname();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        if (!user.emailVerified && pathname !== "/auth/verify-email")
          navigate("/auth/verify-email");

        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);

        if (pathname === "/") {
          setInitialLoading(false);
          return;
        }

        let path_allowed = false;
        for (const path of unprotectedRoutes) {
          if (pathname.startsWith(path)) {
            path_allowed = true;
            break;
          }
        }

        if (!path_allowed) {
          navigate("/auth");
        }
      }
      setInitialLoading(false);
    });
  }, [auth]);

  const signUp = async (email: string, password: string, uname: string) => {
    setLoading(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        if (user) {
          setUser(user);

          // send request to backend to create user data
          // await setDoc(doc(db, "userdata", email), {
          //   plan: null,
          //   profiles: [],
          //   subscribed: false,
          //   createdAt: Date.now(),
          //   power: "member",
          //   id: email,
          //   ips: [],
          // });

          const reference = ref(db, "users/" + user.uid);
          set(reference, {
            createdAt: Date.now(),
            email: user.email,
            name: uname,
            ips: [],
            notifications: [],
            projects: [],
            tasks: [],
          } as UserData);

          navigate("/auth/verify-email");
          // navigate("/dashboard");
        }
      })
      .catch((error) => {
        throw new Error(error.message);
      });

    setLoading(false);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setUser(userCredential.user);

        // const addIpToUserData = async () => {
        //   const docRef = doc(db, "userdata", email);
        //   const docSnap = await getDoc(docRef);
        //   const userData = docSnap.data();

        //   let ip: string = "0.0.0.0";
        //   try {
        //     ip = await fetch("https://api.ipify.org/?format=json")
        //       .then((res) => res.json())
        //       .then((data) => data.ip);
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   const ipList = userData?.ips || [];

        //   for (const ip of ipList) {
        //     if (ip == ip) return;
        //   }

        //   if (userData?.plan) {
        //     const plan = userData.plan;
        //     const planToDevices: any = {
        //       basic: 1,
        //       standard: 2,
        //       premium: 4,
        //     };

        //     if (plan && ipList.length >= planToDevices[plan]) {
        //       throw new Error(
        //         "You have reached the maximum number of devices for your plan. Please logout from your account on a different to continue."
        //       );
        //     }
        //   }

        //   await setDoc(doc(db, "userdata", email), {
        //     ...userData,
        //     ips: [...ipList, ip],
        //   });
        // };
        // addIpToUserData();
      })
      .catch((error) => {
        throw new Error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const logout = async () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        // const removeIpFromUserData = async () => {
        //   const docRef = doc(db, "userdata", user?.email || "");
        //   const docSnap = await getDoc(docRef);
        //   const userData = docSnap.data();

        //   let ip: string = "0.0.0.0";
        //   try {
        //     ip = await fetch("https://api.ipify.org/?format=json")
        //       .then((res) => res.json())
        //       .then((data) => data.ip);
        //   } catch (err) {
        //     console.error(err);
        //   }

        //   const ipList = userData?.ips || [];

        //   const newIpList = ipList.filter(
        //     (ipInList: string) => ipInList !== ip
        //   );

        //   await setDoc(doc(db, "userdata", user?.email || ""), {
        //     ...userData,
        //     ips: newIpList,
        //   });
        // };
        // removeIpFromUserData();

        setUser(null);
      })
      .catch((error) => {
        throw new Error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const deleteAcc = async () => {
    setLoading(true);
    deleteUser(auth.currentUser!)
      .then(() => {
        setUser(null);
        // navigate("/auth/goodbye");
      })
      .catch((error) => {
        throw new Error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const resetPassword = async () => {
    setLoading(true);
    await sendPasswordResetEmail(auth, auth.currentUser!.email || "")
      .then(() => {
        // navigate("/auth/reset-password");
      })
      .catch((error) => {
        throw new Error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const verifyEmail = async () => {
    setLoading(true);
    await sendEmailVerification(auth.currentUser!)
      .catch((error) => {
        throw new Error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const changePassword = async (password: string) => {
    setLoading(true);
    await updatePassword(auth.currentUser!, password)
      .then(() => {
        navigate("/account");
      })
      .catch((error) => {
        throw new Error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const changeEmail = async (email: string) => {
    setLoading(true);
    await updateEmail(auth.currentUser!, email)
      .then(() => {
        navigate("/account");
      })
      .catch((error) => {
        throw new Error(error.message);
      })
      .finally(() => setLoading(false));
  };

  const memoedValue = useMemo(
    () => ({
      user,
      signUp,
      signIn,
      logout,
      deleteAcc,
      changePassword,
      changeEmail,
      verifyEmail,
      resetPassword,
      error,
      loading,
    }),
    [user, loading]
  );
  return (
    <AuthContext.Provider value={memoedValue}>
      {!initialLoading && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
