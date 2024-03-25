import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  ClerkLoaded,
  ClerkLoading,
} from "@clerk/nextjs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <div className="bg-black h-24 w-screen fixed">
      <div className="flex justify-center md:justify-between items-center h-full mx-4">
        <SignedIn>
          <Link className="flex items-center" href="/dashboard">
            <Image
              alt="logo"
              src="/imgs/logos/logo_transparent.png"
              width={96}
              height={96}
              unoptimized
            />
          </Link>
        </SignedIn>
        <SignedOut>
          <Link className="flex items-center" href="/">
            <Image
              alt="logo"
              src="/imgs/logos/logo_transparent.png"
              width={96}
              height={96}
              unoptimized
            />
          </Link>
        </SignedOut>
        <div className="hidden md:flex items-center space-x-2 text-white">
          <Button variant={"ghost"}><Link href="/about">About</Link></Button>
          <Button variant={"ghost"}><Link href="/feedback">Feedback</Link></Button>
          <ClerkLoading>
            <AiOutlineLoading3Quarters className="animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton redirectUrl="/" mode="modal">
                <Button variant={"ghost"}>Login</Button>
              </SignInButton>
            </SignedOut>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
};

export default Header;
