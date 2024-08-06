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

import { useUser } from "@clerk/nextjs";
import useData from "@/hooks/useData";

import { ProjectData, Role } from "@/types";

import { doesUserExist, getUserRoleInProject } from "@/utils/users";
import {
  addMemberToProject,
  addMentorToProject,
  deleteProject,
  lockProject,
  memberLeaveProject,
  mentorLeaveProject,
  unlockProject,
} from "@/utils/projects";
import { navigate } from "@/actions/navigate";
import { formatDate } from "@/lib/utils";

const ProjectSettings = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const [saveProjectInfo, setSaveProjectInfo] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");

  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<Role>();

  const { user } = useUser();
  const { projectData, projectId, setProjectData } = useData();

  const [deleteProjectDialog, setDeleteProjectDialog] = useState<string>("");
  const [memberToAddName, setMemberToAddName] = useState<string>("");
  const [mentorToAddName, setMentorToAddName] = useState<string>("");

  useEffect(() => {
    if (!saveProjectInfo) return;

    setLoading(true);

    if (projectName === "") {
      toast.error("Project name cannot be empty", {
        position: "top-right",
      });

      setSaveProjectInfo(false);
      setLoading(false);
      return;
    }

    if (projectName.length > 100) {
      toast.error("Project name cannot be longer than 100 characters", {
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

    toast.success("Project information saved successfully", {
      position: "top-right",
    });

    setSaveProjectInfo(false);
    setLoading(false);
  }, [saveProjectInfo]);

  useEffect(() => {
    if (!projectData || !projectId || !user) return;

    setProjectName(projectData.name);
    setIsLocked(projectData.isLocked);

    (async () => {
      const role = await getUserRoleInProject(user.username!, projectId);
      if (role) setUserRole(role);
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
    if (deleteProjectDialog !== "Delete Project") {
      toast.error("Please type 'Delete Project' to confirm");
      return;
    }

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

  const handleAddMember = async () => {
    if (!memberToAddName) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const userExists = await doesUserExist(memberToAddName);
      if (!userExists) {
        toast.error("User does not exist");
        setMemberToAddName("");
        setLoading(false);
        return;
      }

      await addMemberToProject(projectId, memberToAddName);

      toast.success("Added member to project successfully");
    } catch (error) {
      toast.error("Failed to add member to project");
      console.error(error);
    } finally {
      setMemberToAddName("");
      setLoading(false);
    }
  };

  const handleAddMentor = async () => {
    if (!mentorToAddName) {
      toast.error("Username cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const userExists = await doesUserExist(mentorToAddName);
      if (!userExists) {
        toast.error("User does not exist");
        setMentorToAddName("");
        setLoading(false);
        return;
      }

      await addMentorToProject(projectId, mentorToAddName);

      toast.success("Added mentor to project successfully");
    } catch (error) {
      toast.error("Failed to add mentor to project");
      console.error(error);
    } finally {
      setMentorToAddName("");
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper
      loading={loading}
      pageName="Project Settings"
      role={userRole}
    >
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
                value={formatDate(projectData?.createdAt!)}
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
                username={projectData?.owner!}
                projectID={projectId}
                userRole={userRole || "member"}
                setUserRole={setUserRole}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded bg-[#1c1c1c] p-4">
            <h5 className="font-semibold md:text-lg lg:text-xl">
              Members
              {userRole !== "member" && !isLocked && (
                <>
                  {" - "}
                  <Dialog>
                    <DialogTrigger className="text-sm md:text-base lg:text-lg text-orange-1 cursor-pointer hover:underline">
                      (add members)
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                          Add a member
                        </DialogTitle>
                        <DialogDescription className="text-sm md:text-base pb-2">
                          Add a member to this project by entering their user
                          ID.
                        </DialogDescription>

                        <Input
                          className="text-lg"
                          placeholder="Username"
                          value={memberToAddName}
                          onChange={(e) => setMemberToAddName(e.target.value)}
                        />
                        <div className="h-1" />

                        <DialogClose
                          className="button-primary py-2"
                          onClick={handleAddMember}
                        >
                          Add Member
                        </DialogClose>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </h5>

            <div className="flex flex-col space-y-2 divide-y-2 divide-[gray]">
              {(!projectData?.members || projectData?.members.length === 0) && (
                <p className="text-[gray] text-lg">
                  No members in this project
                </p>
              )}
              {projectData?.members &&
                projectData?.members.map((name, index) => (
                  <UserOptions
                    key={index}
                    type="member"
                    username={name}
                    projectID={projectId}
                    userRole={userRole || "member"}
                    setUserRole={setUserRole}
                    className={index !== 0 ? "pt-2" : ""}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded bg-[#1c1c1c] p-4">
            <h5 className="font-semibold md:text-lg lg:text-xl">
              Mentors{" "}
              {userRole === "owner" && !isLocked && (
                <>
                  {" - "}
                  <Dialog>
                    <DialogTrigger className="text-sm md:text-base lg:text-lg text-yellow-1 cursor-pointer hover:underline">
                      (add mentors)
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                          Add a mentor
                        </DialogTitle>
                        <DialogDescription className="text-sm md:text-base pb-2">
                          Add a mentor to this project by entering their user
                          ID.
                        </DialogDescription>

                        <Input
                          className="text-lg"
                          placeholder="Username"
                          value={mentorToAddName}
                          onChange={(e) => setMentorToAddName(e.target.value)}
                        />
                        <div className="h-1" />

                        <DialogClose
                          className="button-primary py-2"
                          onClick={handleAddMentor}
                        >
                          Add Mentor
                        </DialogClose>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </h5>

            <div className="flex flex-col space-y-2 divide-y-2 divide-[gray]">
              {(!projectData?.mentors || projectData?.mentors.length === 0) && (
                <p className="text-[gray] text-lg">
                  No mentors in this project
                </p>
              )}
              {projectData?.mentors &&
                projectData.mentors.map((name, index) => (
                  <UserOptions
                    key={index}
                    type="mentor"
                    username={name}
                    projectID={projectId}
                    userRole={userRole || "member"}
                    setUserRole={setUserRole}
                    className={index !== 0 ? "pt-2" : ""}
                  />
                ))}
            </div>
          </div>
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
                        from our servers. Type &quot;Delete Project&quot; to
                        confirm.
                      </DialogDescription>

                      <Input
                        className="text-lg"
                        placeholder="Delete Project"
                        value={deleteProjectDialog}
                        onChange={(e) => setDeleteProjectDialog(e.target.value)}
                      />
                      <div className="h-1" />

                      <DialogClose
                        className="button-danger py-2"
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
                      await memberLeaveProject(projectId, user?.username!)
                        .then(() => {
                          toast.success("Left project successfully");
                          navigate("/projects");
                        })
                        .catch((error) => {
                          console.error(error);
                          toast.error("Failed to leave project");
                        });
                    } else {
                      await mentorLeaveProject(projectId, user?.username!)
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
