import { requireRole } from "@/server/auth";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  await requireRole("admin");

  return children;
};

export default AdminLayout;