import { Kanit } from "next/font/google";
import Image from "next/image";

const kanit = Kanit({ subsets: ["latin"], weight: ["600"] });

const Banner = () => {
  return (
    <div className="min-h-screen pt-24 lg:pt-0 flex flex-col lg:flex-row -space-y-24 sm:space-y-0 justify-between">
      <div className="w-full h-full lg:min-h-screen flex flex-col space-y-3 md:space-y-5 items-center lg:items-start px-16 lg:px-28 lg:pt-10 justify-center">
        <h1
          className={`${kanit.className} text-center lg:text-left text-4xl md:text-5xl lg:text-6xl  uppercase`}
        >
          TASKCRAFT: THE AI-INTEGRATED TOOL FOR Simple PROJECT MANAGEMENT
        </h1>
        <p className="text-xl md:text-2xl xl:text-3xl text-center lg:text-left">
          TaskCraft is the simplest and easiest way to manage your projects with
          AI integration. Get started today!
        </p>
      </div>
      <div className="w-full lg:w-[85%] min-h-[60vh] sm:min-h-screen lg:h-auto -z-10 flex items-end justify-center">
        <Image
          src="imgs/catgirl.png"
          alt=""
          width={100}
          height={100}
          className="w-full opacity-70"
          unoptimized
        />
      </div>
    </div>
  );
};

export default Banner;
