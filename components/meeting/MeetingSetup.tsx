"use client";

import { Call, DeviceSettings, VideoPreview } from "@stream-io/video-react-sdk";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { notFound, useRouter } from "next/navigation";
import useData from "@/hooks/useData";

const MeetingSetup = ({
  setIsSetupComplete,
  call,
}: {
  setIsSetupComplete: (value: boolean) => void;
  call?: Call;
}) => {
  const [isMicCamEnabled, setIsMicCamEnabled] = useState(false);
  const router = useRouter();

  const { projectData } = useData();

  useEffect(() => {
    if (isMicCamEnabled) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamEnabled, call?.camera, call?.microphone]);

  if (!call) {
    return notFound();
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">{projectData?.name!} Meeting Setup</h1>
      <VideoPreview />

      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamEnabled}
            onChange={(e) => setIsMicCamEnabled(e.target.checked)}
          />
          Join without Microphone and Camera
        </label>

        <DeviceSettings />
      </div>

      <Button
        className="rounded-md bg-green-500 py-2.5"
        onClick={() => {
          call?.join();
          setIsSetupComplete(true);
        }}
      >
        Join Meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
