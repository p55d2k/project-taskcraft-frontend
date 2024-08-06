import { DataProvider } from "@/hooks/useData";

import { Toaster } from "react-hot-toast";

import RecoilContextProvider from "@/providers/recoilProvider";

import { Lato } from "next/font/google";
import "@/styles/globals.css";

import "react-datepicker/dist/react-datepicker.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "900", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#3371ff",
          fontSize: "16px",
        },
      }}
      afterSignOutUrl={"/sign-in"}
    >
      <html lang="en">
        <body className={lato.className}>
          <RecoilContextProvider>
            <DataProvider>
              <Toaster position="bottom-center" reverseOrder={false} />
              {children}
            </DataProvider>
          </RecoilContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
