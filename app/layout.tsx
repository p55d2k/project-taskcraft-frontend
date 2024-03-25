import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const open_sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project TaskCraft | The free open-source project management tool",
  description:
    "TaskCraft is a free open-source project management tool which is designed to be simple and easy to use, while being efficient.",
  icons: ["/imgs/logos/logo_black.png"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={open_sans.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
