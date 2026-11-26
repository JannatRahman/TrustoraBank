import Navbar from "@/components/Navbar";
import Loans from "@/components/Loans";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loan & Credit Solutions",
  description:
    "Explore transparent financing options with predictable repayments, straightforward eligibility, and fast digital origination.",
};

export default function LoansPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9F7F7] pt-6">
        <Loans />
      </main>
      <Footer />
    </>
  );
}
