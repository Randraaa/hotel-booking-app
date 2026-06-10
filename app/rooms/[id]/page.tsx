import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaBed, FaCompress, FaCompass, FaCheck } from "react-icons/fa";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import RoomCard from "@/components/rooms/RoomCard";
import RoomDetailsGallery from "@/components/rooms/RoomDetailsGallery";
import RoomDetailsBookingCard from "@/components/rooms/RoomDetailsBookingCard";
import RoomDetailsReviews from "@/components/rooms/RoomDetailsReviews";
import { getRoomById, getSimilarRooms } from "@/services/rooms";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    return {
      title: "Suite Not Found — Hotel Luxe",
      description: "The requested luxury suite is not available.",
    };
  }

  return {
    title: `${room.name} — Hotel Luxe`,
    description: `${room.description} Book this premium suite with tailored specifications at Hotel Luxe.`,
  };
}

export default async function RoomDetailPage({ params }: Props) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

  const similarRooms = await getSimilarRooms(room, 3);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <Navbar />

      {/* Breadcrumb / Back Navigation Banner */}
      <section className="relative px-6 pt-24 pb-8 md:px-8 max-w-7xl mx-auto w-full shrink-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(248,205,126,0.1),transparent_40%)] blur-3xl" />
        <Link
          href="/rooms"
          className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-amber-300 hover:text-white transition duration-300 cursor-pointer"
        >
          <FaArrowLeft className="h-3 w-3" />
          <span>Back to Sanctuaries</span>
        </Link>
      </section>

      {/* Main Details and Booking Sidebar Section */}
      <section className="flex-1 px-6 pb-24 md:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          
          {/* Main Info Column */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Gallery */}
            <RoomDetailsGallery images={room.galleryImages} />

            {/* Room Title Header */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {room.tag && (
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-md">
                    {room.tag}
                  </span>
                )}
                <span className="rounded-full bg-white/5 border border-white/10 px-3.5 py-1 text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
                  Category: {room.name.includes("Villa") ? "Private Villa" : room.name.includes("Penthouse") ? "Penthouse Suite" : "Luxury Suite"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
                {room.name}
              </h1>
            </div>

            {/* Specifications row cards */}
            <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-8">
              <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-4 flex flex-col items-center text-center">
                <FaCompress className="h-5 w-5 text-amber-300 mb-2" />
                <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Room Size</span>
                <span className="text-sm font-semibold text-white">{room.specifications.size}</span>
              </div>
              
              <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-4 flex flex-col items-center text-center">
                <FaBed className="h-5 w-5 text-amber-300 mb-2" />
                <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Beds Set</span>
                <span className="text-sm font-semibold text-white">{room.specifications.bed}</span>
              </div>
              
              <div className="rounded-2xl border border-white/5 bg-slate-900/10 p-4 flex flex-col items-center text-center">
                <FaCompass className="h-5 w-5 text-amber-300 mb-2" />
                <span className="text-slate-500 text-[10px] uppercase tracking-wider block mb-0.5">Exquisite View</span>
                <span className="text-sm font-semibold text-white">{room.specifications.view}</span>
              </div>
            </div>

            {/* Full description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white uppercase tracking-wider">About the Retreat</h3>
              <p className="text-sm leading-7 text-slate-400">
                {room.description} Each retreat has been meticulously styled using premium hardwood paneling, warm ambient light, custom furnishings, and rich textiles. Experience a true beachfront sanctuary designed to offer absolute tranquility.
              </p>
              <p className="text-sm leading-7 text-slate-400">
                Relax in our deep soaking tubs, rest on Egyptian cotton linens, and configure your comfort with automated in-room smart controls. The retreat includes high-tech access panels, complete soundproofing, and full room amenities support.
              </p>
            </div>

            {/* Amenities Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white uppercase tracking-wider">Suite Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xs border border-amber-400/20">
                      <FaCheck className="h-2.5 w-2.5" />
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
                
                {/* Visual expansion cards to represent extensive check lists */}
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xs border border-amber-400/20">
                    <FaCheck className="h-2.5 w-2.5" />
                  </span>
                  <span>Egyptian cotton linens & towels</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xs border border-amber-400/20">
                    <FaCheck className="h-2.5 w-2.5" />
                  </span>
                  <span>Smart panel automated room control</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-300 text-xs border border-amber-400/20">
                    <FaCheck className="h-2.5 w-2.5" />
                  </span>
                  <span>Luxury bathrobes & slip slippers</span>
                </div>
              </div>
            </div>

            {/* Review sections component */}
            <RoomDetailsReviews
              reviews={room.reviews}
              rating={room.rating}
              reviewsCount={room.reviewsCount}
            />

          </div>

          {/* Sticky Booking Sidebar Column */}
          <div className="lg:col-span-2">
            <RoomDetailsBookingCard room={room} />
          </div>

        </div>
      </section>

      {/* Similar Rooms Section */}
      {similarRooms.length > 0 && (
        <section className="border-t border-white/5 bg-slate-950 px-6 py-24 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-300 font-semibold mb-2">Recommended</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Similar Sanctuaries</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarRooms.map((similarRoom) => (
                <RoomCard
                  key={similarRoom.id}
                  room={similarRoom}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
