import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loading...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
