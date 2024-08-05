"use client";

import { loadingAtom } from "@/atoms/loadingAtom";
import { useRecoilState } from "recoil";

import DashboardWrapper from "@/components/DashboardWrapper";
import MeetingCard from "@/components/meeting/MeetingCard";

import { useEffect, useState } from "react";

import { navigate } from "@/actions/navigate";
import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import toast from "react-hot-toast";

import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

const MeetingPage = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const { user } = useAuth();
  const { projectId, projectData } = useData();
  const client = useStreamVideoClient();

  useEffect(() => {
    (async () => {
      if (!client || !user || !projectId || !projectData) return;

      try {
        const id = projectId;
        const call = client.call("default", id);

        if (!call) {
          toast.error("Failed to create call");
          throw new Error("Failed to create call");
        }

        const startsAt = new Date(Date.now()).toISOString();
        const description = projectData.name + " Meeting";

        await call.getOrCreate({
          data: {
            starts_at: startsAt,
            custom: {
              description,
              projectId,
            },
          },
        });
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
        console.error(error);
      }
    })();
  }, []);

  return (
    <DashboardWrapper loading={loading} pageName="Meeting">
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 pt-4 md:pt-6">
        <MeetingCard
          img="/icons/join-meeting.svg"
          title="Join Meeting"
          description="Join the current project meeting"
          className="bg-blue-1"
          handleClick={() => navigate(`/meeting/${projectId}`)}
        />
        <MeetingCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="View your past meeting recordings"
          className="bg-yellow-1"
          handleClick={() => navigate("/recordings")}
        />
      </section>
    </DashboardWrapper>
  );
};

export default MeetingPage;
