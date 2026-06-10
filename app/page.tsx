import BookingSearchForm from "@/components/home/BookingSearchForm";
import HeroSection from "@/components/home/HeroSection";
import FeaturedRooms from "@/components/home/FeaturedRooms";
import Facilities from "@/components/home/Facilities";
import SpecialOffers from "@/components/home/SpecialOffers";
import Testimonials from "@/components/home/Testimonials";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(248,205,126,0.18),transparent_42%)] blur-3xl" />
        <HeroSection />
        <BookingSearchForm />
        <FeaturedRooms />
        <Facilities />
        <SpecialOffers />
        <Testimonials />
      </div>
      <Footer />
    </main>
  );
}

