import type { BookingRequest, BookingResponse, Booking } from "@/types/booking";

export async function createBooking(
  booking: BookingRequest,
): Promise<BookingResponse> {
  const confirmationNumber = `HL-${Math.floor(Math.random() * 900000 + 100000)}`;

  if (typeof window !== "undefined") {
    try {
      const existing = localStorage.getItem("luxe-reservations");
      const reservations: Booking[] = existing ? JSON.parse(existing) : [];

      const newReservation: Booking = {
        ...booking,
        id: confirmationNumber,
        confirmationNumber,
        status: "upcoming",
        createdAt: new Date().toISOString(),
      };

      reservations.push(newReservation);
      localStorage.setItem("luxe-reservations", JSON.stringify(reservations));
    } catch (e) {
      console.error("Failed to save reservation to localStorage:", e);
    }
  }

  return Promise.resolve({
    success: true,
    confirmationNumber,
    booking,
  });
}

export async function cancelBooking(confirmationNumber: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const existing = localStorage.getItem("luxe-reservations");
    if (!existing) return false;

    const reservations: Booking[] = JSON.parse(existing);
    const updated = reservations.map((res) => {
      if (res.confirmationNumber === confirmationNumber) {
        return { ...res, status: "cancelled" as const };
      }
      return res;
    });

    localStorage.setItem("luxe-reservations", JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error("Failed to cancel reservation:", e);
    return false;
  }
}

