import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Email Verification | TaskCraft",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      {children}
    </div>
  );
}
