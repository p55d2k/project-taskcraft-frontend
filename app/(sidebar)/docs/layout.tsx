import DocProvider from "@/providers/DocProvider";
import type { Metadata } from "next";
import "@/styles/docs.css";

export const metadata: Metadata = {
  title: "Documents | TaskCraft",
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
