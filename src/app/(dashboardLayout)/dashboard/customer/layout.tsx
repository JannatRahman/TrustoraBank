import { requireRoleRedirect } from "@/server/auth";
import type { ReactNode } from "react";

interface CustomerLayoutProps {
  children: ReactNode;
}

const CustomerLayout = async ({ children }: CustomerLayoutProps) => {
  await requireRoleRedirect("customer");

  return children;
};

export default CustomerLayout;
