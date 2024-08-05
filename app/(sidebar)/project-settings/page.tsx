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

import { ProjectData, Role } from "@/types";

import { doesUserExist, getUserRoleInProject, nameFromId } from "@/utils/users";
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

  const [deleteProjectDialog, setDeleteProjectDialog] = useState<string>("");
  const [userIDToAddMember, setUserIDToAddMember] = useState<string>("");
  const [userIDToAddMentor, setUserIDToAddMentor] = useState<string>("");

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
    if (!userIDToAddMember) {
      toast.error("User ID cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const userExists = await doesUserExist(userIDToAddMember);

      if (!userExists) {
        toast.error("User does not exist");
        return;
      }

      await addMemberToProject(projectId, userIDToAddMember);

      const name = await nameFromId(userIDToAddMember);
      setMemberNames([...memberNames, name]);

      toast.success("Added member to project successfully");
    } catch (error) {
      toast.error("Failed to add member to project");
      console.error(error);
    } finally {
      setUserIDToAddMember("");
      setLoading(false);
    }
  };

  const handleAddMentor = async () => {
    if (!userIDToAddMentor) {
      toast.error("User ID cannot be empty");
      return;
    }

    try {
      setLoading(true);

      const userExists = await doesUserExist(userIDToAddMentor);

      if (!userExists) {
        toast.error("User does not exist");
        return;
      }

      await addMentorToProject(projectId, userIDToAddMentor);

      const name = await nameFromId(userIDToAddMentor);
      setMentorNames([...mentorNames, name]);

      toast.success("Added mentor to project successfully");
    } catch (error) {
      toast.error("Failed to add mentor to project");
      console.error(error);
    } finally {
      setUserIDToAddMentor("");
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
            <h5 className="font-semibold md:text-lg lg:text-xl">
              Members{" - "}
              <Dialog>
                <DialogTrigger className="text-sm md:text-base lg:text-lg text-purple-1 cursor-pointer hover:underline">
                  (add members)
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl md:text-2xl lg:text-3xl">
                      Add a member
                    </DialogTitle>
                    <DialogDescription className="text-sm md:text-base pb-2">
                      Add a member to this project by entering their user ID.
                    </DialogDescription>

                    <Input
                      className="text-lg"
                      placeholder="User ID"
                      value={userIDToAddMember}
                      onChange={(e) => setUserIDToAddMember(e.target.value)}
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
            </h5>

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

          <div className="flex flex-col gap-2 rounded bg-[#1c1c1c] p-4">
            <h5 className="font-semibold md:text-lg lg:text-xl">
              Mentors{" - "}
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
                      Add a mentor to this project by entering their user ID.
                    </DialogDescription>

                    <Input
                      className="text-lg"
                      placeholder="User ID"
                      value={userIDToAddMentor}
                      onChange={(e) => setUserIDToAddMentor(e.target.value)}
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
            </h5>

            <div className="flex flex-col space-y-2 divide-y-2 divide-[gray]">
              {mentorNames.length === 0 && (
                <p className="text-[gray] text-lg">
                  No mentors in this project
                </p>
              )}
              {mentorNames.map((name, i) => (
                <UserOptions
                  key={i}
                  type="mentor"
                  username={name}
                  userID={
                    projectData?.mentors && i < projectData.mentors.length
                      ? projectData.mentors[i]
                      : ""
                  }
                  projectID={projectId}
                  userRole={userRole || "member"}
                  setUserRole={setUserRole}
                  mentorNames={mentorNames}
                  setMentorNames={setMentorNames}
                  className={i !== 0 ? "pt-2" : ""}
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
