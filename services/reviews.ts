import { apiGet, apiPost } from "@/services/api";
import type { Review } from "@/types/room";

export async function getRoomReviews(roomId: string): Promise<Review[]> {
  return apiGet<Review[]>(`/rooms/${roomId}/reviews`);
}

export async function submitReview(
  roomId: string,
  reviewData: { author: string; rating: number; comment: string }
): Promise<Review> {
  return apiPost<Review, { author: string; rating: number; comment: string }>(
    `/rooms/${roomId}/reviews`,
    reviewData
  );
}
