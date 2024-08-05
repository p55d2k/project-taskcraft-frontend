"use client";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";

import ActiveCollaborators from "./ActiveCollaborators";
import { Editor } from "@/components/editor/Editor";
import { Input } from "@/components/ui/input";
import Loading from "../Loading";
import DocHeader from "./DocHeader";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { updateDocumentTitle } from "@/actions/room.actions";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
}: CollaborativeRoomProps) => {
  const [docTitle, setDocTitle] = useState(roomMetadata?.title || "");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);

      try {
        if (docTitle !== roomMetadata?.title) {
          const updatedDocument = await updateDocumentTitle(roomId, docTitle);

          if (updatedDocument) {
            setIsEditing(false);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsEditing(false);
        updateDocumentTitle(roomId, docTitle);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [docTitle, roomId]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loading loading />}>
        <div className="collaborative-room">
          <DocHeader>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {isEditing && !loading ? (
                <Input
                  type="text"
                  value={docTitle}
                  ref={inputRef}
                  placeholder="Enter title"
                  onChange={(e) => {
                    setDocTitle(e.target.value);
                  }}
                  onKeyDown={updateTitleHandler}
                  disabled={!isEditing}
                  className="document-title-input"
                />
              ) : (
                <p
                  className="document-title"
                  onClick={() => {
                    setIsEditing(true);
                    inputRef.current?.focus();
                  }}
                >
                  {docTitle}
                </p>
              )}

              {!isEditing && (
                <Image
                  unoptimized
                  src="/assets/icons/edit.svg"
                  alt="Edit"
                  width={24}
                  height={24}
                  onClick={() => setIsEditing(true)}
                  className="pointer"
                />
              )}

              {!isEditing && <p className="view-only-tag">View only</p>}

              {loading && <p className="text-sm text-gray-400">Saving...</p>}
            </div>

            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />
            </div>
          </DocHeader>
          <Editor roomId={roomId} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
