"use client";

import DashboardWrapper from "@/components/DashboardWrapper";
import AddDocumentButton from "@/components/docs/AddDocumentButton";
import DeleteModal from "@/components/docs/DeleteModal";

import {
  getDocumentsInProject,
  updateDocumentAccess,
} from "@/actions/room.actions";
import { navigate } from "@/actions/navigate";

import { loadingAtom } from "@/atoms/loadingAtom";
import { useRecoilState } from "recoil";

import { useUser } from "@clerk/nextjs";
import useData from "@/hooks/useData";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Link from "next/link";
import Image from "next/image";

import { getUsersPartOfProject } from "@/utils/projects";
import { getUserEmails } from "@/utils/users";
import { dateConverter } from "@/lib/utils";
import { RoomData } from "@liveblocks/node";

const DocsPage = () => {
  const [loading, setLoading] = useRecoilState(loadingAtom);

  const { user, isLoaded } = useUser();
  const { projectId, projectData } = useData();

  const [projectEmails, setProjectEmails] = useState<string[]>([]);
  const [roomDocuments, setRoomDocuments] = useState<{ data: RoomData[] }>({
    data: [],
  });

  useEffect(() => {
    (async () => {
      if (!user || !isLoaded) return;

      setLoading(true);

      try {
        const usersPartOfProject = await getUsersPartOfProject(projectId);
        const fetchedEmails = await getUserEmails(usersPartOfProject);

        setProjectEmails(fetchedEmails);
        setRoomDocuments(
          await getDocumentsInProject(
            user?.emailAddresses[0].emailAddress,
            projectId
          )
        );
      } catch (error) {
        toast.error("Error getting documents");
        console.log(`Error getting documents: ${error}`);

        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, isLoaded]);

  useEffect(() => {
    (async () => {
      if (
        !projectData?.updateDocumentAccess ||
        !roomDocuments ||
        !projectEmails
      )
        return;

      setLoading(true);

      try {
        for (const roomData of roomDocuments.data) {
          await updateDocumentAccess(roomData.id, projectEmails);
        }
      } catch (error) {
        toast.error("Error updating document access");
        console.log(`Error updating document access: ${error}`);
      } finally {
        setLoading(false);
      }
    })();
  }, [roomDocuments]);

  return (
    <DashboardWrapper loading={loading} pageName="Docs">
      <div className="flex flex-col space-y-8 divide-y-2 divide-[gray] pt-4 md:pt-6">
        {roomDocuments.data.length > 0 ? (
          <div className="document-list-container">
            <div className="document-list-title">
              <h3 className="text-28-semibold">All Documents</h3>
              <AddDocumentButton
                userId={user?.id!}
                email={user?.emailAddresses[0].emailAddress!}
                projectEmails={projectEmails}
                projectId={projectId}
              />
            </div>

            <ul className="document-ul">
              {roomDocuments.data.map(
                ({ id, metadata, createdAt }: any, index: number) => (
                  <li key={index} className="document-list-item">
                    <Link
                      href={`/docs/${id}`}
                      className="flex flex-1 items-center gap-4"
                    >
                      <div className="hidden rounded-md bg-dark-500 p-2 sm:block">
                        <Image
                          unoptimized
                          src="/icons/doc.svg"
                          alt="File"
                          width={40}
                          height={40}
                        />
                      </div>

                      <div className="space-y-1">
                        <p className="line-clamp-1 text-lg">{metadata.title}</p>
                        <p className="text-sm font-light text-blue-100">
                          Created about {dateConverter(createdAt)}
                        </p>
                      </div>
                    </Link>

                    <DeleteModal roomId={id} />
                  </li>
                )
              )}
            </ul>
          </div>
        ) : (
          <div className="document-list-empty">
            <Image
              unoptimized
              src="/icons/doc.svg"
              alt="Document"
              width={40}
              height={40}
              className="mx-auto"
            />

            <AddDocumentButton
              userId={user?.id!}
              email={user?.emailAddresses[0].emailAddress!}
              projectEmails={projectEmails}
              projectId={projectId}
            />
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default DocsPage;
