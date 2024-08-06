"use client";

import Image from "next/image";
import Link from "next/link";

import SidebarSection from "./SidebarSection";
import SidebarLink from "./SidebarLink";

import getSidebarItems from "@/constants/sidebar";

import { UserButton } from "@clerk/nextjs";

const Sidebar = () => {
  return (
    <div className="fixed w-64 h-screen overflow-y-scroll hidden lg:flex flex-col justify-between py-4 px-6 bg-black">
      <div className="flex flex-col space-y-4">
        <Link href="/dashboard">
          <Image
            unoptimized
            src="/logo-nobg.png"
            width={125}
            height={125}
            alt=""
            className="w-full"
          />
        </Link>

        <div className="flex flex-col space-y-4">
          {getSidebarItems().map((section, index) => (
            <SidebarSection key={index} title={section.name}>
              {section.items.map((item, index) => (
                <SidebarLink
                  key={index}
                  Icon={item.icon}
                  text={item.text}
                  link={item.link}
                />
              ))}
            </SidebarSection>
          ))}
        </div>
      </div>

      <UserButton />
    </div>
  );
};

export default Sidebar;
