import { Toaster } from "react-hot-toast";
import AdminNavLink from "./components/admin-navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {

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
      <AdminNavLink />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
