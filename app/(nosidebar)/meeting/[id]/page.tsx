"use client";

import Loading from "@/components/Loading";
import MeetingRoom from "@/components/meeting/MeetingRoom";
import MeetingSetup from "@/components/meeting/MeetingSetup";

import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useUser } from "@clerk/nextjs";

import { useState } from "react";

interface MeetingProps {
  params: {
    id: string;
  };
}

const Meeting = ({ params }: MeetingProps) => {
  const { user, isLoaded } = useUser();

  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const { call, isCallLoading } = useGetCallById(params.id, user?.username!);

  if (!isLoaded || isCallLoading) return <Loading loading />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
