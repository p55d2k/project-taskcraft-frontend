"use server";

import { revalidatePath } from "next/cache";
import { liveblocks } from "@/lib/liveblocks";
import { parseStringify } from "@/lib/utils";
import { redirect } from "next/navigation";
import { generateUniqueId } from "@/utils/unique";

export const createDocument = async (
  userId: string,
  email: string,
  projectEmails: string[],
  projectId: string
) => {
  const roomId = generateUniqueId();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled document",
      projectId,
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    projectEmails.forEach((projectEmail) => {
      usersAccesses[projectEmail] = ["room:write"];
    });

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    revalidatePath(`/docs`);
    revalidatePath(`/docs/${roomId}`);

    return parseStringify(room);
  } catch (error) {
    console.log(`Error creating document: ${error}`);
  }
};

export const getDocument = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const hasAccess = Object.keys(room.usersAccesses).includes(userId);

    if (!hasAccess) {
      throw new Error("You don't have access to this document");
    }

    return parseStringify(room);
  } catch (error) {
    console.log(`Error getting document: ${error}`);
  }
};

export const updateDocumentTitle = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });

    revalidatePath(`/docs/${roomId}`);

    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(`Error updating document: ${error}`);
  }
};

export const getDocuments = async (email: string, projectId: string) => {
  try {
    const room = await liveblocks.getRooms({
      userId: email,
    });

    if (!room) {
      return [];
    }

    const filteredRooms = room.data.filter(
      (room) => room.metadata.projectId === projectId
    );

    return parseStringify({
      data: filteredRooms,
    });
  } catch (error) {
    console.log(`Error while getting rooms: ${error}`);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);

    revalidatePath(`/docs`);

    redirect("/docs");
  } catch (error) {
    console.log(`Error deleting document: ${error}`);
  }
};
