import { requireRole } from "@/server/auth";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const CustomerLayout = async ({ children }: AdminLayoutProps) => {
  await requireRole("customer");

  return children;
};

export default CustomerLayout;