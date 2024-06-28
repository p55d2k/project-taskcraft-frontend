import Header from "@/components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project TaskCraft - The AI-incorporated project management tool",
  description:
    "Project TaskCraft is a free-to-use project management tool which is designed to be simple and easy to use, while being efficient with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
