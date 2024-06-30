import React from "react";

interface SidebarSectionProps {
  children: React.ReactNode;
  title: string;
}

const SidebarSection = ({ children, title }: SidebarSectionProps) => {
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-[#b3b3b3] text-[13px] uppercase font-light">{title}</p>
      {children}
    </div>
  );
};

export default SidebarSection;
