import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

import { Bricolage_Grotesque } from "next/font/google";
import { Mona_Sans } from "next/font/google";

import SearchProvider from "@/components/SearchProvider";

import { ModalProvider } from "./context/ModalContext";

// const inter = Inter({
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

const brico = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const mona = Mona_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
        <ModalProvider>
          <SearchProvider>{children}</SearchProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
