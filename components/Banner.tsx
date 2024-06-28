import { Kanit } from "next/font/google";
import Image from "next/image";

const kanit = Kanit({ subsets: ["latin"], weight: ["600"] });

const Banner = () => {
  return (
    <div className="flex flex-col">
      <div className="h-screen flex flex-col lg:flex-row justify-between">
        <div className="w-full h-full flex flex-col space-y-3 md:space-y-5 items-center lg:items-start px-16 lg:px-28 justify-center">
          <h1
            className={`${kanit.className} text-center lg:text-left text-4xl md:text-5xl lg:text-6xl  uppercase`}
          >
            TASKCRAFT: THE AI-INTEGRATED TOOL FOR PROJECT MANAGEMENT
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl">
            TaskCraft is the simplest and easiest way to manage your projects
            with AI integration. Get started today!
          </p>
        </div>
        <div className="w-full h-full flex items-end justify-center">
          <Image
            src="imgs/catgirl.png"
            alt=""
            width={100}
            height={100}
            className="w-full"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
