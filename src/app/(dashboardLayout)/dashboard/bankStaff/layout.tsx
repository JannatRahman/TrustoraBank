import { requireRoleRedirect } from "@/server/auth";
import type { ReactNode } from "react";

interface BankStaffLayoutProps {
  children: ReactNode;
}

const BankStaffLayout = async ({ children }: BankStaffLayoutProps) => {
  await requireRoleRedirect("banking-staff");

  return children;
};

export default BankStaffLayout;
