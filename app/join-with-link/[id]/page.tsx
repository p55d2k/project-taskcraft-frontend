"use client";

import Loading from "@/components/Loading";
import { addMemberToProject, doesProjectExist } from "@/utils/projects";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface JoinWithLinkPageProps {
  params: {
    id: string;
  };
}

const JoinWithLinkPage = ({ params }: JoinWithLinkPageProps) => {
  const { id } = params;
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || !user) return;
    (async () => {
      if (!id) router.push("/projects");

      const exists = await doesProjectExist(id);

      if (!exists) {
        toast.error("Project does not exist");
        router.push("/projects");
      }

      try {
        await addMemberToProject(id, user?.username!);

        toast.success("Successfully joined project!");
        router.push(`/projects`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to join project");
      }
    })();
  }, [user, isLoaded]);

  return <Loading loading />;
};

export default JoinWithLinkPage;
