import type { Metadata } from "next";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";

import SearchProvider from "@/components/SearchProvider";
import { ModalProvider } from "./context/ModalContext";

import IntroScreen from "@/components/Intro";

const brico = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

export const metadata: Metadata = {
  title: "Eden Courtyard",
  description: "For the sky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="tracking-[-0.3px]">
      <body className={brico.className}>
        <IntroScreen />
        <ModalProvider>
          <SearchProvider>{children}</SearchProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
