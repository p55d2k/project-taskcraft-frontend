"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { getProject, getUserProjects } from "@/utils/projects";
import { navigate } from "@/utils/actions";
import { kanit } from "@/utils/fonts";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import { UserProjectStatus } from "@/typings";

import { AiOutlineLoading } from "react-icons/ai";
import { IoAdd } from "react-icons/io5";
import toast from "react-hot-toast";

const ProjectsPage = () => {
  const { user } = useAuth();
  const { setProjectData, setProjectId } = useData();

  const [clickedProjectId, setClickedProjectId] = useState<string | null>(null);
  const [trySwitch, setTrySwitch] = useState<boolean>(false);

  const [projects, setProjects] = useState<UserProjectStatus[] | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!trySwitch) return;

    async function getProjectData() {
      if (!clickedProjectId) return;

      setLoading(true);

      const projectData = await getProject(clickedProjectId);

      if (projectData === null) {
        toast.error("Failed to fetch project data. Please try again later.");

        setLoading(false);
        setTrySwitch(false);

        return;
      }

      setProjectData(projectData);
      setProjectId(clickedProjectId);

      setLoading(false);
      setTrySwitch(false);

      navigate("/dashboard");
    }

    getProjectData();
  }, [trySwitch, clickedProjectId]);

  useEffect(() => {
    if (!refresh) return;

    async function getProjects() {
      if (!user) return;

      setLoading(true);

      const projects = await getUserProjects(user?.uid);

      if (projects === null) {
        toast.error("Failed to fetch projects. Please try again later.");

        setProjects([]);
        setLoading(false);
        setRefresh(false);

        return;
      }

      setProjects(projects);
      setLoading(false);
      setRefresh(false);
    }

    getProjects();
  }, [refresh, user]);

  return (
    <div className="w-full h-full">
      {loading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <AiOutlineLoading className="text-white text-6xl animate-spin" />
        </div>
      )}

      <div className="h-28 w-full flex items-center justify-center">
        <Image
          unoptimized
          src="/imgs/project-bg.png"
          width={100}
          height={80}
          alt=""
          className="absolute top-0 left-0 w-full h-60 lg:h-36 -z-10 object-cover opacity-40"
        />
        <h1
          className={`${kanit.className} font-semibold text-center text-3xl md:text-4xl lg:text-5xl -mt-8`}
        >
          Projects
        </h1>
      </div>

      <div className="flex flex-col space-y-4 md:space-y-6 p-4 md:p-8 lg:px-12 xl:px-16">
        <div className="hidden md:flex flex-row space-x-2 items-center justify-between">
          <span className="lg:text-lg">
            Below are the projects you have access to. Click on a project to
            view.
          </span>

          {/* refresh button */}
          <button
            onClick={() => setRefresh(true)}
            disabled={loading}
            className={`${
              loading ? "button-disabled" : "button-primary"
            } !w-auto !py-2`}
          >
            Refresh
          </button>
        </div>

        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <Link
            href="/projects/new"
            className="project-card bg-slate-900 flex-row"
          >
            <IoAdd size={26} />
            <h2 className="font-semibold text-xl">New project</h2>
          </Link>

          {projects?.map((project) => (
            <div
              className="project-card bg-[#141414] flex-col justify-between"
              key={project.id}
              onClick={() => {
                setClickedProjectId(project.id);
                setTrySwitch(true);
              }}
            >
              <div className="flex flex-col">
                <h2 className="font-semibold text-xl">{project.name}</h2>
                <p className="text-gray-500">
                  ID: {project.id.slice(0, 10)}...
                </p>
              </div>
              <p className="text-gray-500 capitalize">Role: {project.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
