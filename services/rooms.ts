import { apiGet } from "@/services/api";
import type { Room } from "@/types/room";

export async function getFeaturedRooms(): Promise<Room[]> {
  return apiGet<Room[]>("/rooms");
}

export async function getRoomById(id: string): Promise<Room | null> {
  try {
    return await apiGet<Room>(`/rooms/${id}`);
  } catch (error) {
    console.error(`Error fetching room by ID ${id}:`, error);
    return null;
  }
}

export async function getSimilarRooms(currentRoom: Room, limit = 3): Promise<Room[]> {
  try {
    const allRooms = await getFeaturedRooms();
    return allRooms
      .filter((r) => r.id !== currentRoom.id)
      .sort((a, b) => {
        const diffA = Math.abs(a.pricePerNight - currentRoom.pricePerNight);
        const diffB = Math.abs(b.pricePerNight - currentRoom.pricePerNight);
        return diffA - diffB;
      })
      .slice(0, limit);
  } catch (error) {
    console.error("Error calculating similar rooms:", error);
    return [];
  }
}
