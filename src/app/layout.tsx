import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavLink from "@/components/navbar";
import NavLinkNoAuth from "@/components/navbar-signup";
import useAuthStore from "@/contexts/auth-store";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Used2Book",
  description: "Book community web app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
            },
          }}
        />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}