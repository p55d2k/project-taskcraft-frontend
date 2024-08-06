// @ts-ignore

"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { CallRecording } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import RecordingCard from "@/components/meeting/RecordingCard";
import DashboardWrapper from "@/components/DashboardWrapper";
import useData from "@/hooks/useData";

const Recordings = () => {
  const { callRecordings, isLoading } = useGetCalls();
  const { projectId } = useData();
  const router = useRouter();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (!callRecordings || !projectId) return;

        const projectCallRecordings = callRecordings.filter((call) => {
          return call.state?.custom?.projectId === projectId;
        });

        const callData = await Promise.all(
          projectCallRecordings?.map((meeting) => meeting.queryRecordings()) ??
            []
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error: any) {
        toast.error(error.message);
        console.error(error);
      }
    })();
  }, [callRecordings]);

  return (
    <DashboardWrapper loading={isLoading} pageName="Meeting Recordings">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 pt-4 md:pt-6">
        {recordings && recordings.length > 0 ? (
          recordings.map((meeting: CallRecording, index) => (
            <RecordingCard
              key={index}
              icon={"/icons/recordings.svg"}
              title={meeting.filename?.substring(0, 20) + "..."}
              date={new Date(meeting.start_time).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
              link={(meeting as CallRecording).url}
              handleClick={() =>
                router.push(`${(meeting as CallRecording).url}`)
              }
            />
          ))
        ) : (
          <h1 className="text-2xl font-bold text-white">No Recordings Found</h1>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default Recordings;
