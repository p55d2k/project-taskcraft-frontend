"use client";

import {
  CallControls,
  CallingState,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loading from "@/components/Loading";

import { useState } from "react";
import { LayoutList, Users } from "lucide-react";
import { useRouter } from "next/navigation";

type CallLayoutType =
  | "speaker-left"
  | "speaker-right"
  | "speaker-top"
  | "speaker-bottom"
  | "grid";

const layoutMapping: { [key: string]: CallLayoutType } = {
  Grid: "grid",
  "Speaker Left": "speaker-left",
  "Speaker Right": "speaker-right",
  "Speaker Top": "speaker-top",
  "Speaker Bottom": "speaker-bottom",
};

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");

  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const router = useRouter();

  if (callingState !== CallingState.JOINED) return <Loading loading />;

  const CallLayout: React.FC = () => {
    switch (layout) {
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition={"right"} />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition={"left"} />;
      case "speaker-bottom":
        return <SpeakerLayout participantsBarPosition={"top"} />;
      case "grid":
        return <PaginatedGridLayout />;
      default:
        return <SpeakerLayout participantsBarPosition={"bottom"} />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full items-center max-w-[1000px]">
          <CallLayout />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <CallControls onLeave={() => router.push("/meeting")} />

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {Object.keys(layoutMapping).map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setLayout(layoutMapping[item])}
                >
                  {item}
                </DropdownMenuItem>

                {index !== Object.keys(layoutMapping).length - 1 && (
                  <DropdownMenuSeparator className="border-dark-1" />
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />
      </div>
    </section>
  );
};

export default MeetingRoom;
