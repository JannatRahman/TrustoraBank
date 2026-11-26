import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Everyday Banking Services",
  description:
    "Explore Trustora Bank's accounts, seamless transfers, and deposit & withdrawal options designed for modern financial living.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F7F7] pt-6">
        <Services />
      </main>
      <Footer />
    </>
  );
}
