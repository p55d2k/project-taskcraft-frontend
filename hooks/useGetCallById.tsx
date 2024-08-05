import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import { isUserPartOfProject } from "@/utils/users";

import { useEffect, useState } from "react";

export const useGetCallById = (id: string, userId: string) => {
  const [call, setCall] = useState<Call>();
  const [isCallLoading, setIsCallLoading] = useState(true);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    (async () => {
      const { calls } = await client.queryCalls({
        filter_conditions: { id },
      });

      const partOfProject = await isUserPartOfProject(userId, id);

      if (calls.length > 0 && partOfProject) {
        setCall(calls[0]);
      }

      setIsCallLoading(false);
    })();
  }, [client, id]);

  return { call, isCallLoading };
};
