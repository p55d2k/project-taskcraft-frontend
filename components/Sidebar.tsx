"use client";

import Image from "next/image";
import Link from "next/link";

import SidebarSection from "./SidebarSection";
import SidebarItem from "./SidebarItem";
import SidebarLink from "./SidebarLink";

import useAuth from "@/hooks/useAuth";
import { navigate } from "@/utils/actions";

import { MdLogout, MdAccountCircle } from "react-icons/md";
import { FaHome, FaVideo } from "react-icons/fa";
import { IoMdSchool, IoMdSettings, IoIosChatboxes } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import { GoArrowSwitch } from "react-icons/go";
import { TbReport, TbReportSearch } from "react-icons/tb";

const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <div className="fixed w-64 h-screen overflow-y-scroll hidden lg:flex flex-col justify-between py-4 px-6 bg-[#141414]">
      <div className="flex flex-col space-y-4">
        <Link href="/dashboard">
          <Image
            unoptimized
            src={"logo-nobg.png"}
            width={125}
            height={125}
            alt=""
            className="w-full"
          />
        </Link>

        <div className="flex flex-col space-y-4">
          <SidebarSection title="quick links">
            <SidebarLink Icon={FaHome} text="Home" link="/dashboard" />
            <SidebarLink Icon={IoIosChatboxes} text="Chat" link="/chat" />
            <SidebarLink Icon={FaVideo} text="Meeting" link="/meet" />
            <SidebarLink
              Icon={TbReportSearch}
              text="View Reports"
              link="/reports"
            />
          </SidebarSection>
          <SidebarSection title="writing">
            <SidebarLink
              Icon={TbReport}
              text="Write Report"
              link="/reports/new"
            />
            <SidebarLink
              Icon={TfiWrite}
              text="Paraphrase Tool"
              link="/writing/pp"
            />
            {/* https://github.com/natsuozawa/citeapa */}
            <SidebarLink
              Icon={IoMdSchool}
              text="Citation Generator"
              link="/writing/cite"
            />
          </SidebarSection>
          <SidebarSection title="management">
            <SidebarLink
              Icon={GoArrowSwitch}
              text="Switch Project"
              link="/projects"
            />
            <SidebarLink
              Icon={IoMdSettings}
              text="Project Settings"
              link="/project-settings"
            />
          </SidebarSection>
        </div>
      </div>

      <div className="flex flex-col space-y-1 border-t-2 border-white py-3 mt-6">
        <SidebarLink Icon={MdAccountCircle} text="Account" link="/account" />
        <SidebarItem
          Icon={MdLogout}
          text="Logout"
          onClick={() => {
            logout();
            // navigate("/auth/goodbye");
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
