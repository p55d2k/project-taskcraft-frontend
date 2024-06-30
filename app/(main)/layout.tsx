import MobileSidebar from "@/components/MobileSidebar";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col md:flex-row">
      <MobileSidebar />
      <Sidebar />
      <main className="pt-24 lg:pt-0 lg:pl-64 h-full">
        <div className="px-6 mx-auto pt-6 h-full mb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
