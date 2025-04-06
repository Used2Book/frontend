"use client";

import useAuthStore from "@/contexts/auth-store";
import SettingsSidebar from "@/components/sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="h-screen flex flex-col"> 

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {user && <SettingsSidebar />} 

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
