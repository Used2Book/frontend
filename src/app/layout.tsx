import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavLink from "@/components/navbar";
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Used2book",
  description: "book community web app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth scroll-pt-12">
      <body >
        {children}
      </body>
      {/* <Script src="https://cdn.omise.co/omise.js" /> */}
    </html>
  );
}
