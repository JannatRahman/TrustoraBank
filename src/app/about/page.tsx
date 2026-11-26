import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Discover Trustora Bank's mission to deliver secure, transparent, and customer-first digital banking technology.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F7F7] pt-6">
        <AboutUs />
      </main>
      <Footer />
    </>
  );
}
