"use client";

import { tokenProvider } from "@/actions/stream.actions";

import Loading from "@/components/Loading";

import { useUser } from "@clerk/nextjs";

import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";

import { useEffect, useState } from "react";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    (async () => {
      if (!user || !isLoaded) return;
      if (!apiKey) throw new Error("No Stream API key provided");

      try {
        const client = new StreamVideoClient({
          apiKey,
          user: {
            id: user?.id,
            name: user?.username || user?.id,
            image: user?.imageUrl,
          },
          tokenProvider,
        });

        setVideoClient(client);
      } catch (error) {
        console.error("Error initializing StreamClient:", error);
      }
    })();
  }, [user, apiKey, isLoaded]);

  if (!videoClient) return <Loading loading />;
  else return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
