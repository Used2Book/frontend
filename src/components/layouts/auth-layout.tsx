"use client";

import useAuthStore from "@/contexts/auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe, getAllUserGenres } from "@/services/user";
import Loading from "@/app/loading";
import SetupModal from "@/components/setup-modal";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [loading, setLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [preferredGenres, setPreferredGenres] = useState<number[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true);
        if (user) {
          if (user.role !== "user") {
            router.replace("/auth");
            return;
          }
          const userGenres = await getAllUserGenres();
          if (!user.gender || !userGenres || userGenres.length === 0) {
            setShowSetupModal(true);
            setLoading(false);
            return;
          }
          setPreferredGenres(userGenres.map((g: { id: number }) => g.id));
          setLoading(false);
          return;
        }

        const fetchedUser = await getMe();
        if (!fetchedUser || fetchedUser.role !== "user") {
          clearAuth();
          router.replace("/auth");
          return;
        }
        setUser(fetchedUser);
        const userGenres = await getAllUserGenres();
        if (!fetchedUser.gender || !userGenres || userGenres.length === 0) {
          setShowSetupModal(true);
          setLoading(false);
          return;
        }
        setPreferredGenres(userGenres.map((g: { id: number }) => g.id));
        setLoading(false);
      } catch (error) {
        console.error("Error in checkUser:", error);
        clearAuth();
        router.replace("/auth");
      }
    };
    checkUser();
  }, [setUser, clearAuth, router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {showSetupModal && (
        <SetupModal
          onComplete={() => {
            setShowSetupModal(false);
            setLoading(false);
          }}
        />
      )}
      {!showSetupModal && children}
    </>
  );
};

export default AuthLayout;