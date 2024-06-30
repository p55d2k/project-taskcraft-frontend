"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { usePathname } from "next/navigation";

interface SidebarLinkProps {
  link: string;
  Icon: IconType;
  text: string;
}

const SidebarLink = ({ link, Icon, text }: SidebarLinkProps): JSX.Element => {
  const pathname = usePathname();

  return (
    <Link
      href={link}
      className={`flex items-center space-x-3 cursor-pointer p-2 px-3 bg-transparent text-white hover:bg-[#1f1f1f] transition-all duration-300 ease-in-out ${
        pathname === link && "border-l-2 border-white"
      }`}
    >
      <Icon size={24} />
      <p className="text-white">{text}</p>
    </Link>
  );
};

export default SidebarLink;
