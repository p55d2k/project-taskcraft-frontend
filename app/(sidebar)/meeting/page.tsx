"use client";

import { loadingAtom } from "@/atoms/loadingAtom";
import { useRecoilState } from "recoil";

import DashboardWrapper from "@/components/DashboardWrapper";

import { useEffect } from "react";
import Image from "next/image";

import { navigate } from "@/actions/navigate";
import useData from "@/hooks/useData";

import toast from "react-hot-toast";

import { useStreamVideoClient } from "@stream-io/video-react-sdk";

const MeetingPage = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const { projectId, projectData } = useData();
  const client = useStreamVideoClient();

  useEffect(() => {
    (async () => {
      if (!client || !projectId || !projectData) return;

      setLoading(true);

      try {
        const newCall = client.call("default", projectId);

        if (!newCall) {
          toast.error("Failed to create call");
          throw new Error("Failed to create call");
        }

        const startsAt = new Date(Date.now()).toISOString();
        const description = projectData.name + " Meeting";

        await newCall.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description,
              projectId,
            },
          },
        });

        console.log("Call created successfully", newCall);
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [client, projectId, projectData]);

  return (
    <DashboardWrapper loading={loading} pageName="Meeting" className="pt-4">
      <div
        className={`bg-blue-1 px-4 py-6 flex flex-col justify-between w-full xl:mx-w-[270px] min-h-[260px] rounded-xl cursor-pointer border-2 border-transparent hover:border-white ease-in-out transition-all duration-400`}
        onClick={() => navigate(`/meeting/${projectId}`)}
      >
        <div className="flex items-center justify-center glassmorphism size-12 rounded-lg">
          <Image
            src={"/icons/join-meeting.svg"}
            alt="meeting"
            width={27}
            height={27}
            unoptimized
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Join Meeting</h1>
          <p className="text-lg font-normal">
            Join the current project meeting
          </p>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default MeetingPage;
