"use client";

import { useState, useEffect } from "react";
// import Link from "next/link";

import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import { kanit } from "@/utils/fonts";

import { UserData } from "@/typings";

import toast from "react-hot-toast";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

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

      setUserData({ ...userData, name: accountName } as UserData);

      setSaveProfileInfo(false);

      toast.success("Profile updated successfully", {
        position: "top-right",
      });

      setLoading(false);
    }
  }, [saveProfileInfo]);

  return (
    <div>
      <h1
        className={`font-semibold text-center lg:text-left text-3xl md:text-4xl lg:text-5xl ${kanit.className} border-b-2 border-[gray] pb-2 lg:pb-4`}
      >
        Your Account
      </h1>

      <div className="py-4 md:py-6 space-y-6 divide-y-2 divide-[gray]">
        <section className="flex flex-col">
          <h3 className="font-semibold text-lg md:text-xl lg:text-2xl">
            Your Profile
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-10">
            <label className="inline-block w-full mt-4">
              <span className="font-semibold">User ID, click to copy</span>
              <button
                className="account-input flex items-center"
                onClick={() => {
                  navigator.clipboard.writeText(user?.uid!);
                  toast.success("Copied to clipboard", {
                    position: "top-right",
                  });
                }}
              >
                {user?.uid}
              </button>
            </label>

            <label className="inline-block w-full mt-4">
              <span className="font-semibold">Name</span>
              <input
                type="text"
                className="account-input hover:border-[gray] hover:text-[gray] focus:border-[gray] focus:text-[gray]"
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
              <Link className="button-secondary !w-auto" href="/auth/delete">
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