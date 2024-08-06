"use client";

import Image from "next/image";
import { createDocument } from "@/actions/room.actions";
import { Button } from "../ui/button";
import { navigate } from "@/actions/navigate";

interface AddDocumentButtonProps {
  userId: string;
  email: string;
  projectEmails: string[];
  projectId: string;
}

const AddDocumentButton = ({
  userId,
  email,
  projectEmails,
  projectId,
}: AddDocumentButtonProps) => {
  const addDocumentHandler = async () => {
    try {
      const room = await createDocument(
        userId,
        email,
        projectId,
        projectEmails
      );

      if (room) navigate(`/docs/${room.id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Button
      type="submit"
      onClick={addDocumentHandler}
      className="gradient-blue flex gap-1 shadow-md"
    >
      <Image
        unoptimized
        src="/icons/add.svg"
        alt="Add"
        width={24}
        height={24}
      />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};

export default AddDocumentButton;
