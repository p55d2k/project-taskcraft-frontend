"use client";

import NewProjectPage1 from "@/components/project/NewProjectPage1";
import NewProjectPage2 from "@/components/project/NewProjectPage2";
import NewProjectPage3 from "@/components/project/NewProjectPage3";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { createProject } from "@/utils/projects";
import { generateUniqueId } from "@/utils/unique";
import { navigate } from "@/utils/actions";

import useAuth from "@/hooks/useAuth";
import { ProjectData } from "@/typings";
import useData from "@/hooks/useData";

import { useRecoilState } from "recoil";
import { loadingAtom } from "@/atoms/loadingAtom";
import Loading from "@/components/Loading";

const NewProject = () => {
  const { user } = useAuth();
  const { setProjectData, setProjectId } = useData();

  const [name, setName] = useState<string>("");
  const [members, setMembers] = useState<string[]>([""]);
  const [mentors, setMentors] = useState<string[]>([""]);

  const [tryCreate, setTryCreate] = useState<boolean>(false);
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!tryCreate || !user) return;

    (async () => {
      setLoading(true);

      const projectData: ProjectData = {
        id: generateUniqueId(),
        name: name,

        chat: [],

        isLocked: false,

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

        setProjectId(projectData.id);
        setProjectData(projectData);

        toast.success("Project created successfully!");
        navigate("/dashboard");
      } else {
        setLoading(false);
        setTryCreate(false);

        toast.error("Something went wrong. Please try again later.");
        console.error("Failed to create project");
      }
    })();
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
      <Loading loading={loading} />

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
