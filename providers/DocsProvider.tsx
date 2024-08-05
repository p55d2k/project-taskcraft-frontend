"use client";

import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import { getDocumentUsers } from "@/actions/user.actions";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const DocsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();

  return (
    <LiveblocksProvider
      authEndpoint={"/api/liveblocks-auth"}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({
          roomId,
          currentUser: user?.email!,
          text,
        });

        return roomUsers;
      }}
    >
      <ClientSideSuspense fallback={<Loading loading />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default DocsProvider;
