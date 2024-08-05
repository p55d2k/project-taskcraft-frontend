import DocsProvider from "@/providers/DocsProvider";
import { Metadata } from "next";

import "@/styles/docs.css";

export const metadata: Metadata = {
  title: "Docs | TaskCraft",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DocsProvider>{children}</DocsProvider>
    </div>
  );
}
