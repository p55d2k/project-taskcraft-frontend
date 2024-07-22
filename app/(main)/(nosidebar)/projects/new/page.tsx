"use client";

import NewProjectPage1 from "@/components/project/NewProjectPage1";
import NewProjectPage2 from "@/components/project/NewProjectPage2";
import NewProjectPage3 from "@/components/project/NewProjectPage3";

import { AiOutlineLoading } from "react-icons/ai";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { createProject } from "@/utils/projects";
import { generateUniqueId } from "@/utils/unique";
import { navigate } from "@/utils/actions";

import useAuth from "@/hooks/useAuth";
import { ProjectData } from "@/typings";
import useData from "@/hooks/useData";

const NewProject = () => {
  const { user } = useAuth();
  const { setProjectData, setProjectId } = useData();

  const [name, setName] = useState<string>("");
  const [members, setMembers] = useState<string[]>([""]);
  const [mentors, setMentors] = useState<string[]>([""]);

  const [tryCreate, setTryCreate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!tryCreate) return;

    async function attemptCreateProject() {
      if (!user) return;

      setLoading(true);

      const projectData: ProjectData = {
        id: generateUniqueId(),
        name: name,
        status: "active",

        chat: [],

        createdAt: Date.now(),

        owner: user.uid,
        members: members,
        mentors: mentors,

        tasks_progress: [],
        tasks_completed: [],
        tasks_overdue: [],
      };

      const res: "success" | "failed" = await createProject(projectData);

      if (res === "success") {
        setLoading(false);
        setTryCreate(false);

        setProjectData(projectData);
        setProjectId(projectData.id);

        toast.success("Project created successfully!");
        navigate("/dashboard");
      } else {
        setLoading(false);
        setTryCreate(false);

        toast.error("Something went wrong. Please try again later.");
        console.error("Failed to create project");
      }
    }

    attemptCreateProject();
  }, [tryCreate]);

  useEffect(() => {
    if (page === 1 && name !== "") {
      setError("");
    }
  }, [page, name]);

  const setNext = () => {
    if (page === 1) {
      if (name === "") {
        setError("Please enter a project name");
        return;
      }
    } else if (page === 3) {
      setTryCreate(true);
    }

    setPage(page + 1);
    setError("");
  };

  const goBack = () => {
    setPage(page - 1);
    setError("");
  };

  return (
    <div className="w-screen h-screen">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <AiOutlineLoading className="text-white text-6xl animate-spin" />
        </div>
      )}

      {page === 1 ? (
        <NewProjectPage1
          name={name}
          error={error}
          setName={setName}
          setNext={setNext}
        />
      ) : page === 2 ? (
        <NewProjectPage2
          members={members}
          error={error}
          setMembers={setMembers}
          setError={setError}
          goBack={goBack}
          setNext={setNext}
        />
      ) : (
        <NewProjectPage3
          mentors={mentors}
          members={members}
          error={error}
          setMentors={setMentors}
          setError={setError}
          goBack={goBack}
          setNext={setNext}
        />
      )}
    </div>
  );
};

export default NewProject;
