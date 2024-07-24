// this is to be used in all pages except the ones with no sidebar, the /tasks page as it has a specific layout for listing tasks, and the /projects page as it has a specific layout for listing projects

"use client";

import useData from "@/hooks/useData";
import { Role } from "@/typings";
import { kanit } from "@/utils/fonts";
import { AiOutlineLoading } from "react-icons/ai";

interface DashboardWrapperProps {
  children: React.ReactNode;
  loading: boolean;
  pageName: string;
  role?: Role;
}

const DashboardWrapper = ({
  children,
  loading,
  pageName,
  role,
}: DashboardWrapperProps) => {
  const { projectData } = useData();

  return (
    <div className="w-full h-screen flex flex-col">
      {loading && (
        <div className="loading-parent">
          <AiOutlineLoading className="text-white text-6xl animate-spin" />
        </div>
      )}

      <div className="flex-grow flex flex-col space-y-4 md:space-y-6 p-4 md:p-8 lg:px-12 xl:px-16 divide-y-2 divide-[gray]">
        <div className="flex flex-col space-y-2" id="header">
          <h1
            className={`${kanit.className} text-2xl md:text-3xl lg:text-4xl text-[gray] flex flex-col md:items-end md:flex-row`}
          >
            <span className="text-4xl md:text-5xl lg:text-6xl font-medium text-white pr-3 text-center md:text-left">
              {projectData?.name && projectData.name.length > 10
                ? projectData?.name.slice(0, 10) + "..."
                : projectData?.name}
            </span>
            <span className="text-center md:text-left">{pageName}</span>
          </h1>

          {role && (
            <span className="hidden sm:flex lg:text-lg capitalize text-[gray]">
              Role: {role}
            </span>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default DashboardWrapper;
