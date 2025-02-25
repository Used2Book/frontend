import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => {
        console.log("🔍 Zustand Updated → User:", user); // ✅ Logs in Browser
        console.log("user.role:", user?.role);
        set({ user });
    },
      setToken: (token) => set({ token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    {
      name: "auth",
      // storage: createJSONStorage(() => localStorage), // ✅ Ensure only runs in client
    }
  )
);

export default useAuthStore;
