import MobileSidebar from "@/components/sidebar/MobileSidebar";
import Sidebar from "@/components/sidebar/Sidebar";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col lg:flex-row">
      <MobileSidebar />
      <Sidebar />
      <main className="pt-24 lg:pt-0 lg:pl-64 h-full w-full">
        <div className="mx-auto h-full p-8 w-full">{children}</div>
      </main>
    </div>
  );
}
