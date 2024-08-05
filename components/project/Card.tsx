import { UserProjectStatus } from "@/types";

interface ProjectCardProps {
  project: UserProjectStatus;
  setClickedProjectId: (id: string) => void;
  setTrySwitch: (value: boolean) => void;
}

const ProjectCard = ({
  project,
  setClickedProjectId,
  setTrySwitch,
}: ProjectCardProps) => {
  return (
    <div
      className="project-card bg-[#141414] flex-col justify-between"
      key={project.id}
      onClick={() => {
        setClickedProjectId(project.id);
        setTrySwitch(true);
      }}
    >
      <div className="flex flex-col">
        <h2 className="font-semibold text-xl">
          {project.name.length > 12
            ? project.name.slice(0, 12) + "..."
            : project.name}
        </h2>
        <p className="text-gray-500">ID: {project.id.slice(0, 10)}...</p>
      </div>
      <p className="text-gray-500 capitalize">Role: {project.role}</p>
    </div>
  );
};

export default ProjectCard;
