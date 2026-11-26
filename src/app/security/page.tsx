import Navbar from "@/components/Navbar";
import Security from "@/components/Security";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security & Protection",
  description:
    "Learn how Trustora Bank safeguards your accounts, transactions, and identity with bcrypt-hashed PINs, session controls, and server-side RBAC.",
};

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F7F7] pt-6">
        <Security />
      </main>
      <Footer />
    </>
  );
}
