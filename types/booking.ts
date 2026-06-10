export type SearchFormValues = {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: string;
};

export type BookingRequest = SearchFormValues & {
  fullName: string;
  email: string;
  phone: string;
  roomId?: string;
  specialRequests?: string;
  totalPrice?: number;
  nights?: number;
};

export type Booking = BookingRequest & {
  id: string;
  confirmationNumber: string;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
};

export type BookingResponse = {
  success: boolean;
  confirmationNumber: string;
  booking: BookingRequest;
};

