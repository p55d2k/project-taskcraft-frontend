"use client";

import Image from "next/image";
import Link from "next/link";

import SidebarSection from "./SidebarSection";
import SidebarLink from "./SidebarLink";

import getSidebarItems from "@/constants/sidebar";

import { SignedIn, UserButton } from "@clerk/nextjs";

const MobileSidebar = () => {
  return (
    <div className="fixed w-screen lg:hidden flex flex-row space-x-2 overflow-y-scroll py-2 items-center z-50 bg-black">
      <div className="flex flex-row space-x-2 overflow-y-scroll p-2">
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
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default MobileSidebar;
