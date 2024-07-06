"use client";

import useData from "@/hooks/useData";

const Dashboard = () => {
  const { projectData } = useData();

  return (
    <div className="h-[140vh]">
      {projectData ? projectData.name : "no project data found"}
    </div>
  );
};

export default Dashboard;
