import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
