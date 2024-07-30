"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface RecordingCardProps {
  title: string;
  date: string;
  icon: string;
  handleClick: () => void;
  link: string;
}

const RecordingCard = ({
  icon,
  title,
  date,
  handleClick,
  link,
}: RecordingCardProps) => {
  return (
    <section className="flex min-h-[258px] w-full flex-col justify-between rounded-[14px] bg-dark-1 px-5 py-8 xl:max-w-[568px]">
      <article className="flex flex-col gap-5">
        <Image src={icon} alt="upcoming" width={28} height={28} />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-base font-normal">{date}</p>
          </div>
        </div>
      </article>
      <article className={cn("flex justify-center relative", {})}>
        <div className="flex gap-2">
          <Button onClick={handleClick} className="rounded bg-blue-1 px-6">
            <Image src="/icons/play.svg" alt="feature" width={20} height={20} />
            &nbsp; Play
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(link);
              toast.success("Link copied to clipboard");
            }}
            className="bg-dark-4 px-6"
          >
            <Image src="/icons/copy.svg" alt="feature" width={20} height={20} />
            &nbsp; Copy Link
          </Button>
        </div>
      </article>
    </section>
  );
};

export default RecordingCard;
