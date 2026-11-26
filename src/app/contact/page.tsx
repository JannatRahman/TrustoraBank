import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Trustora Bank's support team. We're here to answer questions regarding accounts, transactions, security, and digital banking services.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F7F7] pt-6">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
