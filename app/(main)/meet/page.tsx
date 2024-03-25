"use client";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useEffect } from "react";
import { useRef } from "react";

const MeetPage = () => {
  return (
    <div className="bg-slate-900 h-screen w-screen text-white p-8">
      <iframe
        src="https://meet.jit.si/ProjectTaskCraftMeet"
        style={{ height: '100%', width: '100%', border: 'none' }}
        allow="camera;microphone"
      />
    </div>
  );
};

export default MeetPage;
