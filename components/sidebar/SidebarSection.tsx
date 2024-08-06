import React from "react";

interface SidebarSectionProps {
  children: React.ReactNode;
  title: string;
}

const SidebarSection = ({ children, title }: SidebarSectionProps) => {
  return (
    <>
      <div className="flex flex-row space-x-2 lg:hidden">{children}</div>
      <div className="hidden lg:flex flex-col space-y-1">
        <p className="text-[#b3b3b3] text-[13px] uppercase font-light">
          {title}
        </p>
        {children}
      </div>
    </>
  );
};

export default SidebarSection;
