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
      className={`flex items-center space-x-3 cursor-pointer p-2 px-3 bg-transparent text-white hover:bg-[#1f1f1f] transition-all duration-100 ease-in-out ${
        link.startsWith(pathname) && "border-t-2 lg:border-l-2 border-white !bg-[#393939]"
      }`}
    >
      <Icon size={24} />
      <p className="text-white hidden lg:block">{text}</p>
    </Link>
  );
};

export default SidebarLink;
