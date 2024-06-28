"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
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
  if (pathname === "/auth") {
    return null;
  }

  return (
    <div
      className={`${
        isScrolled ? "bg-black" : "bg-transparent"
      } fixed w-screen border-slate-900 border-b-2 px-2 md:px-4 lg:px-8`}
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
            <a
              href="/"
              className={`header-link ${
                pathname === "/" && "header-current-page"
              }`}
            >
              Home
            </a>
            {/* <a href="/feedback" target="_blank">Feedback</a> */}
          </div>
        </div>
        <div className="hidden md:flex flex-row items-center justify-center space-x-2 md:space-x-4">
          <a href="/auth?type=login" className="header-link">
            Login
          </a>
          <a
            href="/auth?type=signup"
            className="header-link border-gray-400 bg-slate-900 hover:border-white border-2 hover:bg-transparent rounded px-3 py-1"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
