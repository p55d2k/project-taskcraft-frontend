"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { navigate } from "@/actions/navigate";

const Header = () => {
  const { user } = useAuth();
  const { userData, projectData } = useData();

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pathname = usePathname();

  return (
    <div
      className={`${
        isScrolled ? "bg-[#141414]" : "bg-transparent"
      } fixed w-full px-4 lg:px-8 py-5`}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-3 md:space-x-7">
          <div>
            <Link href="/" className="flex md:hidden">
              <Image
                unoptimized
                src={"logo-nobg.png"}
                width={75}
                height={75}
                alt=""
              />
            </Link>
            <Link href="/" className="hidden md:flex">
              <Image
                unoptimized
                src={"logo-nobg.png"}
                width={125}
                height={125}
                alt=""
              />
            </Link>
          </div>

          <div className="hidden md:flex flex-row items-center justify-center space-x-2 md:space-x-4">
            {user &&
              (projectData ? (
                <Link href="/dashboard" className="header-link">
                  Dashboard
                </Link>
              ) : (
                <Link href="/projects" className="header-link">
                  Projects
                </Link>
              ))}
          </div>
        </div>
        {user ? (
          <div className="flex items-center justify-center">
            <p onClick={() => navigate("/account")} className="header-link">
              {userData?.name}
            </p>
          </div>
        ) : (
          <div className="flex flex-row items-center justify-center space-x-2 md:space-x-4">
            <Link href="/auth?type=login" className="header-link">
              Login
            </Link>
            <Link
              href="/auth?type=signup"
              className="header-link border-gray-400 bg-slate-900 hover:border-white border-2 hover:bg-transparent rounded px-3 py-1"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
