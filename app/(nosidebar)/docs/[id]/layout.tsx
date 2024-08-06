import DocProvider from "@/providers/DocProvider";
import type { Metadata } from "next";

import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-lexical/styles.css";
import "@/styles/docs-editor-theme.css";
import "@/styles/docs.css";

export const metadata: Metadata = {
  title: "Document | TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DocProvider>{children}</DocProvider>
    </div>
  );
}
