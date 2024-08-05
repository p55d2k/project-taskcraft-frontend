"use client";

import CollaborativeRoom from "@/components/docs/CollaborativeRoom";
import Loading from "@/components/Loading";

import { getDocument } from "@/actions/room.actions";
import { navigate } from "@/actions/navigate";

import { useState, useEffect } from "react";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

const Document = ({ params: { id } }: { params: { id: string } }) => {
  const { user } = useAuth();
  const { projectId } = useData();

  const [room, setRoom] = useState<any>();

  useEffect(() => {
    (async () => {
      if (!user || !user.email) return;

      const room = await getDocument({
        roomId: id,
        userId: user?.email,
      });

      if (!room) navigate("/");
      if (room?.metadata?.projectId !== projectId) navigate("/404");

      setRoom(room);
    })();
  }, [user]);

  if (!room) return <Loading loading />;

  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom roomId={id} roomMetadata={room?.metadata} />
    </main>
  );
};

export default Document;
