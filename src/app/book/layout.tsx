import NavLink from "@/components/navbar";
import { Toaster } from "react-hot-toast";


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
      {/* The navbar, etc. */}
      <NavLink />

        <div>
          {children}

        </div>
      {/* Main Content Area */}

    </div>
  );
}
