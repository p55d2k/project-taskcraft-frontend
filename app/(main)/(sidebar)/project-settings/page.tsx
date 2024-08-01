"use client";

import DashboardWrapper from "@/components/DashboardWrapper";
import { Input } from "@/components/ui/input";

import { loadingAtom } from "@/atoms/loadingAtom";
import { useRecoilState } from "recoil";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { ProjectData, ProjectStatus } from "@/typings";

import { getUserRoleInProject } from "@/utils/users";

const ProjectSettings = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const [saveProjectInfo, setSaveProjectInfo] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");
  const [projectStatus, setProjectStatus] = useState<string>("");

  const [userRole, setUserRole] = useState<string>("");

  const { user } = useAuth();
  const { projectData, projectId, setProjectData } = useData();

  useEffect(() => {
    if (!projectData || !projectId || !user) return;

    setProjectName(projectData.name);
    setProjectStatus(projectData.status);

    (async () => {
      const role = await getUserRoleInProject(user.uid, projectId);
      if (role) setUserRole(role);
    })();
  }, [projectData, projectId]);

  useEffect(() => {
    if (saveProjectInfo) {
      setLoading(true);

      if (projectName === "") {
        toast.error("Project name cannot be empty", {
          position: "top-right",
        });

        setSaveProjectInfo(false);
        setLoading(false);
        return;
      }

      if (
        !["active", "completed", "archived", "paused", "deleted"].includes(
          projectStatus
        )
      ) {
        toast.error(
          "Invalid project status. Allowed values: active, completed, archived, paused, deleted",
          {
            position: "top-right",
          }
        );

        setSaveProjectInfo(false);
        setLoading(false);
        return;
      }

      setProjectData({
        ...projectData,
        name: projectName,
        status: projectStatus as ProjectStatus,
      } as ProjectData);

      setSaveProjectInfo(false);

      toast.success("Project information saved successfully", {
        position: "top-right",
      });

      setLoading(false);
    }
  }, [saveProjectInfo]);

  return (
    <DashboardWrapper loading={loading} pageName="Project Settings">
      <div className="flex flex-col space-y-4 pt-4 md:pt-6">
        <section className="flex flex-col space-y-4">
          <h3 className="font-semibold text-lg md:text-xl lg:text-2xl">
            Your Profile
          </h3>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <label className="inline-block w-full">
              <span className="font-semibold">Project ID, click to copy</span>
              <Input
                className="text-lg cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(projectId);
                  toast.success("Copied to clipboard", {
                    position: "top-right",
                  });
                }}
                value={projectId}
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">Project Name</span>
              <Input
                disabled={userRole !== "owner"}
                className="text-lg"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">Project Status</span>
              <Input
                disabled={userRole !== "owner"}
                className="text-lg"
                type="text"
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
              />
            </label>
          </div>

          <button
            className="button-primary"
            onClick={() => setSaveProjectInfo(true)}
          >
            Save Changes
          </button>
        </section>
      </div>
    </DashboardWrapper>
  );
};

export default ProjectSettings;
