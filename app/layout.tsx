import { DataProvider } from "@/hooks/useData";
import { AuthProvider } from "@/hooks/useAuth";

import { Toaster } from "react-hot-toast";

import RecoilContextProvider from "@/providers/recoilProvider";

import { Lato } from "next/font/google";
import "@/styles/globals.css";

import "@stream-io/video-react-sdk/dist/css/styles.css";

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
    <html lang="en">
      <body className={lato.className}>
        <RecoilContextProvider>
          <AuthProvider>
            <DataProvider>
              <Toaster position="bottom-center" reverseOrder={false} />
              {children}
            </DataProvider>
          </AuthProvider>
        </RecoilContextProvider>
      </body>
    </html>
  );
}
