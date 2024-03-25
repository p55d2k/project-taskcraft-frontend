import { SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "./ui/button";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="bg-slate-900 min-h-screen w-full mt-[-50px] flex flex-col lg:flex-row align-middle justify-center items-center lg:space-x-16">
      <div className="flex flex-col align-middle justify-center space-y-16">
        <Image
          src="/imgs/logos/logo_transparent.png"
          alt="Project Management System Logo"
          width={400}
          height={400}
          unoptimized
        />
      </div>
      <div className="flex flex-col align-middle justify-center items-center lg:items-start lg:max-w-[30vw]">
        <h1 className="text-5xl font-semibold text-white text-center lg:text-left overflow-visible">
          The free <br /> open-source{" "}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 block text-opacity-0 text-white bg-clip-text min-h-28">
            project management tool
          </span>
        </h1>
        <p className="text-2xl font-light text-white text-center lg:text-left">
          An efficient task management tool. <br />
          A better way to communicate. <br />
          <SignedOut>
            Sign up. It&apos;s free. <br />
          </SignedOut>
        </p>
        <SignedIn>
          <Button variant={"destructive"} className="w-1/2 mt-4">
            Go to Dashboard
          </Button>
        </SignedIn>
        <SignedOut>
          <SignUpButton mode="modal" redirectUrl="/dashboard">
            <Button variant={"destructive"} className="w-1/2 mt-4">
              Sign Up
            </Button>
          </SignUpButton>
        </SignedOut>
      </div>
    </div>
  );
};

export default Banner;
