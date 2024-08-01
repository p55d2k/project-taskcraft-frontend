"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Link from "next/link";
import Image from "next/image";

import {
  addMemberToProject,
  doesProjectExist,
  getProject,
} from "@/utils/projects";
import { navigate } from "@/utils/actions";
import { kanit } from "@/utils/fonts";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { IoMdClose } from "react-icons/io";

import Loading from "@/components/Loading";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";

const NewProject = () => {
  const { user } = useAuth();
  const { setProjectData, setProjectId } = useData();

  const [id, setID] = useState<string>("");

  const [tryAdd, setTryAdd] = useState<boolean>(false);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!tryAdd || !user) return;

    (async () => {
      setLoading(true);

      const exists = await doesProjectExist(id);

      if (!exists) {
        toast.error("Project does not exist");
        setLoading(false);
        return;
      }

      try {
        await addMemberToProject(id, user?.uid);

        setProjectId(id);
        setProjectData(await getProject(id));

        navigate(`/dashboard`);
      } catch (error) {
        toast.error("Failed to join project");
      } finally {
        setTryAdd(false);
        setLoading(false);
      }
    })();
  }, [tryAdd]);

  const requestAccess = () => {
    if (!id) {
      setError("Please enter a project ID");
      return;
    }

    setTryAdd(true);
  };

  return (
    <div className="w-screen h-screen">
      <Loading loading={loading} />
      <div className="w-full h-screen flex flex-col lg:flex-row space-y-44 lg:space-y-0 py-12 lg:py-0 justify-between">
        <div className="w-full flex flex-col items-center lg:items-start justify-center px-16 lg:px-28 pb-24 lg:pb-0">
          <p className="flex items-center justify-center text-lg text-center lg:text-left lg:pl-1 font-semibold text-gray-400">
            Join a project
          </p>
          <p
            className={`text-xl md:text-2xl xl:text-3xl text-center lg:text-left lg:pl-1 ${kanit.className} font-semibold`}
          >
            We&apos;re excited to have you on board!
          </p>
          <p
            className={`md:text-lg xl:text-xl font-extralight text-center lg:text-left lg:pl-1 ${kanit.className}`}
          >
            But we&apos;ll need the project ID.
          </p>

          <input
            type="text"
            className="!h-auto input-field text-lg"
            value={id}
            onChange={(e) => setID(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") requestAccess();
            }}
          />

          <p className="text-red-500 text-sm mt-2">{error}</p>
          <div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 pt-3">
            <Link
              className="button-secondary creation-buttons"
              href="/projects"
            >
              <IoMdClose size={20} />
              Cancel
            </Link>
            <button
              className="button-primary creation-buttons"
              onClick={requestAccess}
            >
              Request
            </button>
          </div>
        </div>
        <div className="w-full lg:w-[85%] min-h-[50vh] sm:min-h-screen lg:h-auto -z-10 flex items-end justify-center">
          <Image
            src="/imgs/catgirl2.png"
            alt=""
            width={100}
            height={100}
            className="w-full opacity-80"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default NewProject;
