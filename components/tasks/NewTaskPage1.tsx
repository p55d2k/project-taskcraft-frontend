import { kanit } from "@/utils/fonts";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

interface NewTaskPage1Props {
  description: string;
  setDescription: (description: string) => void;
  priority: "low" | "medium" | "high";
  setPriority: (priority: "low" | "medium" | "high") => void;
  error: string;
  setNext: () => void;
}

const NewTaskPage1 = ({
  description,
  setDescription,
  priority,
  setPriority,
  error,
  setNext,
}: NewTaskPage1Props) => {
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row space-y-44 lg:space-y-0 py-12 lg:py-0 justify-between">
      <div className="w-full flex flex-col items-center lg:items-start justify-center px-16 lg:px-28 pb-24 lg:pb-0">
        <p className="flex items-center justify-center text-lg text-center lg:text-left lg:pl-1 font-semibold text-gray-400">
          Step 1 of 3
        </p>
        <p
          className={`text-xl md:text-2xl xl:text-3xl text-center lg:text-left lg:pl-1 ${kanit.className} font-semibold`}
        >
          Give the task a description and priority
        </p>

        <p className="text-lg font-semibold pt-4 -mb-2">Description</p>
        <input
          type="text"
          className="!h-auto input-field text-lg"
          value={description}
          onChange={(e) => {
            if (e.target.value.length <= 80) setDescription(e.target.value);
          }}
        />
        <p className="text-gray-400 text-sm text-right pt-1">
          {description.length}/80
        </p>

        <p className="text-lg font-semibold pt-4">Priority</p>
        <div className="flex flex-col sm:flex-row items-center justify-center w-full pt-4 space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            className={`button-safe w-full ${
              priority === "low" ? "bg-green-500 text-white" : "opacity-60"
            }`}
            onClick={() => setPriority("low")}
          >
            Low
          </button>
          <button
            className={`button-warning w-full ${
              priority === "medium" ? "bg-yellow-500 text-white" : "opacity-60"
            }`}
            onClick={() => setPriority("medium")}
          >
            Medium
          </button>
          <button
            className={`button-danger w-full ${
              priority === "high" ? "bg-red-500 text-white" : "opacity-60"
            }`}
            onClick={() => setPriority("high")}
          >
            High
          </button>
        </div>

        <p className="text-red-500 text-sm mt-2">{error}</p>
        <div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 pt-3">
          <Link className="button-danger creation-buttons" href="/tasks">
            <IoMdClose size={20} />
            Cancel
          </Link>
          <button className="button-primary creation-buttons" onClick={setNext}>
            Next
          </button>
        </div>
      </div>

      <div className="w-full lg:w-[85%] min-h-[50vh] sm:min-h-screen lg:h-auto -z-10 flex items-end justify-center">
        <Image
          src="/imgs/7.png"
          alt=""
          width={100}
          height={100}
          className="w-full opacity-80"
          unoptimized
        />
      </div>
    </div>
  );
};

export default NewTaskPage1;
