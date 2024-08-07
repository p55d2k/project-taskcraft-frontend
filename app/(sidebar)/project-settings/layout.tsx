import StreamVideoProvider from "@/providers/StreamClientProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Settings | TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </div>
  );
}
