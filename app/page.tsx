import Navbar from "./components/Landing/Navbar";
import HeroSection from "./components/Landing/HeroSection";
import Features from "./components/Landing/Features";
import CTA from "./components/Landing/CTA";
import Footer from "./components/Landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-50">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <HeroSection/>

      {/* Features Section */}
       <Features/>

      {/* CTA Section */}
        <CTA/>

      {/* Footer */}
      {/* <footer className="py-5 text-center text-gray-500 text-sm bg-white border-t">
        © {new Date().getFullYear()} BGIFT — All rights reserved.
      </footer> */}
      <Footer/>
    </div>
  );
}
