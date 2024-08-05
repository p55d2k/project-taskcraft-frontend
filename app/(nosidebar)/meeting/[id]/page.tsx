"use client";

import Loading from "@/components/Loading";
import MeetingRoom from "@/components/meeting/MeetingRoom";
import MeetingSetup from "@/components/meeting/MeetingSetup";

import useAuth from "@/hooks/useAuth";
import { useGetCallById } from "@/hooks/useGetCallById";

import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";

interface MeetingProps {
  params: {
    id: string;
  };
}

const Meeting = ({ params }: MeetingProps) => {
  const { user } = useAuth();

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const { call, isCallLoading } = useGetCallById(params.id, user?.uid || "");

  useEffect(() => {
    if (isCallLoading && !call) return notFound();
  }, [isCallLoading, call]);

  if (isCallLoading || !user) return <Loading loading />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} call={call} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
