"use client";

import NavLinkNoAuth from "@/components/navbar-signup";
import NavLink from "@/components/navbar";
import useAuthStore from "@/contexts/auth-store";
import { Toaster } from "react-hot-toast";
import SettingsSidebar from "@/components/sidebar-old-version";
import AdminNavLink from "./components/admin-navbar";
import AdminSettingsSidebar from "@/app/admin/components/admin-setting-sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="h-full flex flex-col"> 
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
      <AdminNavLink />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* {user && <AdminSettingsSidebar />}  */}

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
