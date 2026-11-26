import { requireRoleRedirect } from "@/server/auth";
import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  await requireRoleRedirect("admin");

  return children;
};

export default AdminLayout;
