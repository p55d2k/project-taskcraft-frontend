"use client";

import Image from "next/image";
import Link from "next/link";

import SidebarSection from "./SidebarSection";
import SidebarButton from "./SidebarButton";
import SidebarLink from "./SidebarLink";

import getSidebarItems from "@/constants/sidebar";

import useData from "@/hooks/useData";
import useAuth from "@/hooks/useAuth";

import { MdLogout, MdAccountCircle } from "react-icons/md";

import { navigate } from "@/actions/navigate";

const Sidebar = () => {
  const { userData } = useData();
  const { logout } = useAuth();

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

      <div className="flex flex-col space-y-1 border-t-2 border-white py-3 mt-6">
        <SidebarLink
          Icon={MdAccountCircle}
          text={userData?.name || "Account"}
          link="/account"
        />
        <SidebarButton
          Icon={MdLogout}
          text="Logout"
          onClick={() => {
            logout();
            navigate("/");
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
