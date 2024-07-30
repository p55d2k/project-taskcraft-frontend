"use client";

import { tokenProvider } from "@/actions/stream.actions";
import Loading from "@/components/Loading";

import useAuth from "@/hooks/useAuth";
import useData from "@/hooks/useData";

import {
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";

import { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  const { userData } = useData();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      if (!user || !userData) return;
      if (!apiKey) throw new Error("No Stream API key provided");

      try {
        const token = await tokenProvider(user.uid);

        const streamVideoClient = new StreamVideoClient({
          apiKey,
          user: {
            id: user.uid,
            name: userData.name || user.displayName || user.email,
          } as User,
          token,
        });

        setVideoClient(streamVideoClient);
      } catch (error) {
        console.error("Error initializing StreamClient:", error);
      }
    })();
  }, [user, userData, apiKey]);

  if (!videoClient) return <Loading loading={true} />;
  else return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
