
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import LandingSections from "@/components/LandingSections";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* Hero Section preserved intact in Banner */}
      <Banner />
      {/* Redesigned Sections A-F below Hero */}
      <LandingSections />
      {/* Contact & Support Section */}
      <Contact />
      <Footer />
    </>
  );
}

