import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import useAuth from "./useAuth";

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const client = useStreamVideoClient();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (!client || !user?.uid) return;

      setIsLoading(true);

      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: "starts_at", direction: -1 }],
          filter_conditions: {
            starts_at: { $exists: true },
            $or: [
              { created_by_user_id: user.uid },
              { members: { $in: [user.uid] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error: any) {
        console.error(error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    })();
  }, [client, user?.uid]);

  return {
    callRecordings: calls,
    isLoading,
  };
};
