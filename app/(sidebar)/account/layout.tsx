import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
