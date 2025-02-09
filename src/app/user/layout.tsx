"use client";
import NavLinkNoAuth from "@/components/navbar-signup";
import NavLink from "@/components/navbar";
import useAuthStore from "@/contexts/auth-store";
import { useEffect, useState } from "react";
import { getMe } from "@/services/auth";
import AuthLayout from "@/components/layouts/auth-layout";
import { Toaster } from "react-hot-toast";
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {


  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <NavLink/>
      <div className="content-padding">{children}</div>
    </div>
    

  );
}
