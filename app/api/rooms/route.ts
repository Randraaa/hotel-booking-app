import { NextResponse } from "next/server";
import { roomsData } from "@/data/roomsData";

export async function GET() {
  // Simulate network latency (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  return NextResponse.json(roomsData);
}
