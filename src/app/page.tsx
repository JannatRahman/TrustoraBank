
import Navbar from "@/components/Navbar";
import Banner from "@/components/Banner";
import AboutUs from "@/components/AboutUs";
import Services from "@/components/Services";
import Loans from "@/components/Loans";
import Security from "@/components/Security";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Banner />
      <AboutUs />
      <Services />
      <Loans />
      <Security />
      <Footer />
    </>
  );
}
