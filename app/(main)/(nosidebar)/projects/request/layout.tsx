import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join a Project | TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
