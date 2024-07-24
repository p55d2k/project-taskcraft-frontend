import { kanit } from "@/utils/fonts";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

interface NewTaskPage1Props {
  name: string;
  error: string;
  setName: (name: string) => void;
  setNext: () => void;
}

const NewTaskPage1 = ({
  name,
  error,
  setName,
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
          Let&apos;s start by giving your project a name
        </p>
        <input
          type="text"
          className="!h-auto input-field text-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setNext();
          }}
        />
        <p className="text-red-500 text-sm mt-2">{error}</p>
        <div className="flex flex-col w-full space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2 pt-3">
          <Link className="button-secondary creation-buttons" href="/projects">
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
          src="/imgs/catgirl2.png"
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
