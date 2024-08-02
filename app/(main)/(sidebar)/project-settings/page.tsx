"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import UserOptions from "@/components/project/UserOptions";
import DashboardWrapper from "@/components/DashboardWrapper";
import { Input } from "@/components/ui/input";

import { loadingAtom } from "@/atoms/loadingAtom";
import { useRecoilState } from "recoil";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { ProjectData, Role } from "@/typings";

import { getUserRoleInProject, nameFromId } from "@/utils/users";
import {
  deleteProject,
  lockProject,
  memberLeaveProject,
  mentorLeaveProject,
  unlockProject,
} from "@/utils/projects";
import { navigate } from "@/utils/actions";

const ProjectSettings = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const [saveProjectInfo, setSaveProjectInfo] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");

  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<Role>();

  const { user } = useAuth();
  const { projectData, projectId, setProjectData } = useData();

  const [ownerName, setOwnerName] = useState<string>("");
  const [memberNames, setMemberNames] = useState<string[]>([]);
  const [mentorNames, setMentorNames] = useState<string[]>([]);

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

      setProjectData({
        ...projectData,
        name: projectName,
      } as ProjectData);

      setSaveProjectInfo(false);

      toast.success("Project information saved successfully", {
        position: "top-right",
      });

      setLoading(false);
    }
  }, [saveProjectInfo]);

  useEffect(() => {
    if (!projectData || !projectId || !user) return;

    setProjectName(projectData.name);
    setIsLocked(projectData.isLocked);

    (async () => {
      const role = await getUserRoleInProject(user.uid, projectId);
      if (role) setUserRole(role);

      if (projectData.owner) {
        const name = await nameFromId(projectData.owner);
        setOwnerName(name);
      }

      if (projectData.members?.length > 0) {
        const names = await Promise.all(
          projectData.members.map((id) => nameFromId(id))
        );
        setMemberNames(names);
      }

      if (projectData.mentors?.length > 0) {
        const names = await Promise.all(
          projectData.mentors.map((id) => nameFromId(id))
        );
        setMentorNames(names);
      }
    })();
  }, [projectData]);

  const handleLockToggle = async () => {
    setLoading(true);

    try {
      if (isLocked) {
        await unlockProject(projectId);
        toast.success("Project unlocked successfully");
      } else {
        await lockProject(projectId);
        toast.success("Project locked successfully");
      }

      setIsLocked(!isLocked);
    } catch (error) {
      toast.error(`Failed to ${isLocked ? "unlock" : "lock"} project`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setLoading(true);

    try {
      if (isLocked) {
        toast.error("Please unlock the project before deleting it");
        return;
      }

      await deleteProject(projectId);

      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper loading={loading} pageName="Project Settings">
      <div className="flex flex-col space-y-8 divide-y-2 divide-[gray] pt-4 md:pt-6">
        <section className="flex flex-col space-y-4">
          <h3 className="font-bold text-lg md:text-xl lg:text-2xl">
            Project Information
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
              <span className="font-semibold">Created At</span>
              <Input
                className="text-lg"
                disabled
                value={
                  new Date(projectData?.createdAt!).toDateString() +
                  " " +
                  new Date(projectData?.createdAt!).toLocaleTimeString()
                }
              />
            </label>

            <label className="inline-block w-full">
              <span className="font-semibold">Project Status</span>
              <Input
                disabled
                className="text-lg"
                type="text"
                value={projectData?.isLocked ? "Locked" : "Unlocked"}
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

        <section className="flex flex-col space-y-4 pt-8">
          <h3 className="font-bold text-lg md:text-xl lg:text-2xl">
            Users in Project
          </h3>

          <div className="flex flex-col gap-2 rounded bg-[#1c1c1c] p-4">
            <h5 className="font-semibold md:text-lg lg:text-xl">Owner</h5>

            <div className="flex flex-col space-y-2 divide-y-2 divide-[gray]">
              <UserOptions
                type="owner"
                username={ownerName}
                userID={projectData?.owner!}
                projectID={projectId}
                userRole={userRole || "member"}
                setUserRole={setUserRole}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded bg-[#1c1c1c] p-4">
            <h5 className="font-semibold md:text-lg lg:text-xl">Members</h5>

            <div className="flex flex-col space-y-2 divide-y-2 divide-[gray]">
              {memberNames.map((name, i) => (
                <UserOptions
                  key={i}
                  type="member"
                  username={name}
                  userID={projectData?.members![i] || ""}
                  projectID={projectId}
                  userRole={userRole || "member"}
                  setUserRole={setUserRole}
                  className={i !== 0 ? "pt-2" : ""}
                />
              ))}
            </div>
          </div>

          {mentorNames.length > 0 && (
            <div className="flex flex-col gap-2 rounded bg-[#1c1c1c] p-4">
              <h5 className="font-semibold md:text-lg lg:text-xl">Mentors</h5>

              <div className="flex flex-col space-y-2 divide-y-2 divide-[gray]">
                {mentorNames.map((name, i) => (
                  <UserOptions
                    key={i}
                    type="mentor"
                    username={name}
                    userID={projectData?.mentors![i] || ""}
                    projectID={projectId}
                    userRole={userRole || "member"}
                    setUserRole={setUserRole}
                    className={i !== 0 ? "pt-2" : ""}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-col space-y-4 pt-8">
          <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-red-500">
            Danger Zone
          </h3>

          <div className="flex flex-col space-y-4 rounded bg-[#1c1c1c] p-4 divide-y-2 divide-[gray]">
            {userRole === "owner" && (
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-red-500">
                    {isLocked ? "Unlock" : "Lock"} this project
                  </p>
                  <p>
                    {isLocked
                      ? "Unlocking this project will allow users to join or leave the project."
                      : "Locking this project will prevent users from joining or leaving the project."}
                  </p>
                </div>
                <button
                  className="button-danger !w-auto"
                  onClick={handleLockToggle}
                >
                  {isLocked ? "Unlock Project" : "Lock Project"}
                </button>
              </div>
            )}

            {userRole === "owner" && (
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between pt-4">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-red-500">
                    Delete your project
                  </p>
                  <p>
                    Once you delete this project, there is no going back. Please
                    be certain.
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger className="button-danger !w-auto">
                    Delete Project
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                        Are you absolutely sure?
                      </DialogTitle>
                      <DialogDescription className="text-sm md:text-base pb-2">
                        This action cannot be undone. This will permanently
                        delete this project and remove the project&apos;s data
                        from our servers.
                      </DialogDescription>
                      <DialogClose
                        className="button-danger py-1"
                        onClick={handleDeleteProject}
                      >
                        Delete Project
                      </DialogClose>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {userRole !== "owner" && (
              <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row justify-between">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-red-500">
                    Leave this project
                  </p>
                  <p>
                    Once you leave this project, you will no longer be able to
                    access it. However, you can rejoin if you are invited back.
                  </p>
                </div>
                <button
                  className="button-danger !w-auto"
                  onClick={async () => {
                    if (userRole === "member") {
                      await memberLeaveProject(projectId, user?.uid!)
                        .then(() => {
                          toast.success("Left project successfully");
                          navigate("/projects");
                        })
                        .catch((error) => {
                          console.error(error);
                          toast.error("Failed to leave project");
                        });
                    } else {
                      await mentorLeaveProject(projectId, user?.uid!)
                        .then(() => {
                          toast.success("Left project successfully");
                          navigate("/projects");
                        })
                        .catch((error) => {
                          console.error(error);
                          toast.error("Failed to leave project");
                        });
                    }
                  }}
                >
                  Leave Project
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardWrapper>
  );
};

export default ProjectSettings;
