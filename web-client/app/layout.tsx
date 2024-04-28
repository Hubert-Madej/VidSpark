import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/navbar";
const inter = Inter({ subsets: ["latin"] });
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes'


export const metadata: Metadata = {
  title: "VidSpark | Web Client",
  description: "Video streaming - web client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme appearance="dark">
          <Navbar />
          {children}
        </Theme>
      </body>
    </html>
  );
}
