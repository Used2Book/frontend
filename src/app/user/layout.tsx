"use client";

import NavLinkNoAuth from "@/components/navbar-signup";
import NavLink from "@/components/navbar";
import useAuthStore from "@/contexts/auth-store";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col h-full">
      <header>
        {user ? <NavLink /> : <NavLinkNoAuth />}
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* {user && <SettingsSidebar />} */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}