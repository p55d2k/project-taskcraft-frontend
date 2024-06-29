"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import useAuth from "@/hooks/useAuth";

const Header = () => {
  const { user } = useAuth();

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
        isScrolled ? "bg-black" : "bg-transparent"
      } fixed w-screen px-2 md:px-4 lg:px-8`}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-3 md:space-x-7">
          <Image
            unoptimized
            src={"logo-nobg.png"}
            width={75}
            height={75}
            alt=""
          />

          <div className="hidden md:flex flex-row items-center justify-center space-x-2 md:space-x-4">
            <Link
              href="/"
              className={`header-link ${
                pathname === "/" && "header-current-page"
              }`}
            >
              Home
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className={`header-link ${
                  pathname === "/dashboard" && "header-current-page"
                }`}
              >
                Dashboard
              </Link>
            )}
            {/* <Link href="/feedback" target="_blank">Feedback</Link> */}
          </div>
        </div>
        {user ? (
          <div className="hidden md:flex items-center justify-center">
            <Link href="/auth?type=login" className="header-link">
              {user.email}
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex flex-row items-center justify-center space-x-2 md:space-x-4">
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
