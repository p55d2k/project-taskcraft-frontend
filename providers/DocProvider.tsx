"use client";

import Loading from "@/components/Loading";
import { getClerkUsers, getDocumentUsers } from "@/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import {
  ClientSideSuspense,
  LiveblocksProvider,
} from "@liveblocks/react/suspense";
import { ReactNode } from "react";

const DocProvider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser();

  return (
    <LiveblocksProvider
      resolveUsers={async ({ userIds }) => {
        const users = await getClerkUsers({ userIds });
        return users;
      }}
      authEndpoint={"/api/liveblocks-auth"}
      resolveMentionSuggestions={async ({ text, roomId }) => {
        return await getDocumentUsers(
          roomId,
          clerkUser?.emailAddresses[0].emailAddress!,
          text
        );
      }}
    >
      <ClientSideSuspense fallback={<Loading loading />}>
        {children}
      </ClientSideSuspense>
    </LiveblocksProvider>
  );
};

export default DocProvider;
