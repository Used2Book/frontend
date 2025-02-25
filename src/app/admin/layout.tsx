import AuthLayout from "@/components/layouts/auth-layout";
import React from "react";
import AuthAdminLayout from "@/components/layouts/auth-admin-layout";
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthAdminLayout>{children}</AuthAdminLayout>;
};

export default ProtectedLayout;
