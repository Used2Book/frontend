"use client";

import NavLinkNoAuth from "@/components/navbar-signup";
import NavLink from "@/components/navbar";
import useAuthStore from "@/contexts/auth-store";
import { Toaster } from "react-hot-toast";
import SettingsSidebar from "@/components/sidebar-old-version";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="h-screen flex flex-col"> 
    <Toaster 
        position="top-right" 
        reverseOrder={false} 
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      {/* The navbar, etc. */}
      <NavLink />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* {user && <SettingsSidebar />}  */}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
