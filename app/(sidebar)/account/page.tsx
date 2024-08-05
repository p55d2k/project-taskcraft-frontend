"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";

import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import { kanit } from "@/utils/fonts";

import { UserData } from "@/types";

import toast from "react-hot-toast";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

import { Input } from "@/components/ui/input";

const AccountPage = () => {
  const { userData, setUserData } = useData();
  const { user } = useAuth();

  const [accountName, setAccountName] = useState(userData?.name || "");
  const [saveProfileInfo, setSaveProfileInfo] = useState(false);

  const [loading, setLoading] = useRecoilState(loadingAtom);

  useEffect(() => {
    if (userData?.name) {
      setAccountName(userData.name);
    }
  }, [userData]);

  useEffect(() => {
    if (saveProfileInfo) {
      setLoading(true);

      if (accountName === "") {
        toast.error("Username cannot be empty", {
          position: "top-right",
        });

        setSaveProfileInfo(false);
        setLoading(false);
        return;
      } else if (accountName.length < 4 || accountName.length > 15) {
        toast.error("Username must be between 4 and 15 characters", {
          position: "top-right",
        });

        setSaveProfileInfo(false);
        setLoading(false);
        return;
      }

      setUserData({ ...userData, name: accountName } as UserData);

      setSaveProfileInfo(false);

      toast.success("Profile updated successfully", {
        position: "top-right",
      });

      setLoading(false);
    }
  }, [saveProfileInfo]);

  return (
    <div className="flex-grow flex flex-col space-y-4 md:space-y-6 p-4 md:p-8 lg:px-12 xl:px-16 divide-y-2 divide-[gray] w-full h-full">
      <h1
        className={`${kanit.className} text-4xl md:text-5xl lg:text-6xl font-medium text-white`}
      >
        <span className="text-center md:text-left">
          Your Account
        </span>
      </h1>

      <div className="py-4 md:py-6 space-y-6 divide-y-2 divide-[gray]">
        <section className="flex flex-col space-y-4">
          <h3 className="font-semibold text-lg md:text-xl lg:text-2xl">
            Your Profile
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <label className="inline-block w-full">
              <span className="font-semibold">User ID, click to copy</span>
              <Input
                className="text-lg cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(user?.uid!);
                  toast.success("Copied to clipboard", {
                    position: "top-right",
                  });
                }}
                value={user?.uid}
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">Username</span>
              <Input
                className="text-lg"
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </label>
          </div>

          <button
            className="button-primary"
            onClick={() => setSaveProfileInfo(true)}
          >
            Save Changes
          </button>
        </section>

        {/* <section className="flex flex-col pt-4">
          <h3 className="font-semibold text-lg md:text-xl lg:text-2xl text-red-500">
            Danger Zone
          </h3>
          <div className="flex flex-col space-y-2 divide-y-2 divide-[gray] bg-[#141414] border-red-500 border-2 p-4 mt-2 rounded">
            <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between">
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-red-500">
                  Delete your account
                </p>
                <p>
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
              </div>
              <Link className="button-danger !w-auto" href="/auth/delete">
                Delete Account
              </Link>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default AccountPage;
